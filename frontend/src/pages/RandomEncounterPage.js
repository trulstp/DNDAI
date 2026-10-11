import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RandomEncounter from "../Components/RandomEncounter/RandomEncounter";
import { SidebarContext } from "../store/sidebar-context";
import { blobToDataUrl } from "../util/blobToDataUrl";
import { fetchOk } from "../util/fetchOk";
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const RandomEncounterPage = () => {
  const sidebarCtx = useContext(SidebarContext);
  const { previousEncounter, setPreviousEncounter } = sidebarCtx;
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [message, setMessage] = useState(null);

  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [encounter, setEncounter] = useState("");
  const [feedActive, setFeedActive] = useState(false);
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);
  const [imageStatus, setImageStatus] = useState({ state: "idle" });
  const [isVisible, setIsVisible] = useState({
    images: true,
    location: true,
    monsters: true,
    stat_blocks: true,
    allies_npcs: true,
    random_events_twists: true,
    treasure_rewards: true,
    obstacles: true,
    mood_atmosphere: true,
  });

  const createNew = () => {
    setError(null);
    setImageStatus({ state: "idle" });
    setFeedActive(false);
    setLoading(false);
    setMessage(null);
    setValue1("");
    setValue2("");
    setCurrentTitle(null);
    setImages(null);
  };

  const handleClick = (uniqueTitle) => {
    setError(null);
    setImageStatus({ state: "idle" });
    setFeedActive(true);
    setLoading(false);
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue1("");
    setValue2("");
    setImages(null);
  };

  const imageGenerator = async () => {
    try {
      const currentDescription =
        currentEncounter[0]?.content?.poster_description;
      if (!currentDescription) {
        console.error("Poster description not found");
        return;
      }

      const options = {
        method: "POST",
        body: JSON.stringify({ message: currentDescription }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      setImageStatus({ state: "loading" });
      const response = await fetchOk(`${API}/app/images`, options);
      const imageUrl = await blobToDataUrl(await response.blob());

      setImages([imageUrl]);
      setPreviousEncounter((prevChats) =>
        prevChats.map((chat) =>
          chat.title === currentTitle ? { ...chat, images: [imageUrl] } : chat
        )
      );
      setImageStatus({ state: "idle" });
    } catch (error) {
      console.error("Error in imageGenerator:", error);
      setImageStatus({ state: "error", message: error.message });
    }
  };

  const getMessages = async () => {
    setError(null);
    setLoading(true);
    try {
      const firstResponse = await fetchOk(
        `${API}/app/encounter?location=${encodeURIComponent(
          value1
        )}&challengeRating=${encodeURIComponent(value2)}`
      );
      const firstData = await firstResponse.json();
      if (firstData.length === 0) {
        throw new Error(
          "No monsters live in that location at this challenge rating. Try another combination."
        );
      }
      setEncounter(firstData);

      const options = {
        method: "POST",
        body: JSON.stringify({
          message: {
            monsters: firstData,
            location: value1,
            challengeRating: value2,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const secondResponse = await fetchOk(`${API}/app/schematic`, options);
      const data = await secondResponse.json();
      // Check if the response has the expected structure
      if (data && typeof data === "object" && "title" in data) {
        setMessage(data);
        setFeedActive(true);
      } else {
        throw new Error("The AI returned an incomplete encounter. Try again.");
      }
    } catch (error) {
      console.error("Error generating encounter:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Use effect for setting the title based on message
  useEffect(() => {
    if (message && !currentTitle) {
      setCurrentTitle(message.title);
    }
  }, [message, currentTitle]);

  // Use effect for updating the previousChats
  useEffect(() => {
    if (currentTitle && message) {
      setPreviousEncounter((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: message.role,
          content: message,
          // Monsters rolled for this encounter, used for stat blocks
          monsterList: Array.isArray(encounter) ? encounter : [],
        },
      ]);
    }
  }, [currentTitle, message, encounter, setPreviousEncounter]);

  const currentEncounter = previousEncounter.filter(
    (previousEncounter) => previousEncounter.title === currentTitle
  );

  // Sidebar items, newest first, one per title
  const historyItems = [];
  for (const entry of [...previousEncounter].reverse()) {
    if (!historyItems.some((item) => item.title === entry.title)) {
      historyItems.push({ title: entry.title, favorite: !!entry.favorite });
    }
  }

  const toggleFavorite = (title) => {
    setPreviousEncounter((prev) => {
      const favorite = !prev.some((e) => e.title === title && e.favorite);
      return prev.map((e) => (e.title === title ? { ...e, favorite } : e));
    });
  };

  const deleteEncounter = (title) => {
    setPreviousEncounter((prev) => prev.filter((e) => e.title !== title));
    if (title === currentTitle) createNew();
  };

  // Opened from the home page's Recent list: show that encounter, then clear the request
  // so a reload doesn't reopen it
  const location = useLocation();
  const navigate = useNavigate();
  const openTitle = location.state?.openTitle;
  useEffect(() => {
    if (!openTitle) return;
    if (previousEncounter.some((entry) => entry.title === openTitle)) {
      handleClick(openTitle);
    }
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTitle]);

  const toggleVisibility = (section) => {
    setIsVisible((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <React.Fragment>
      {sidebarCtx.sidebarOpen && (
        <Sidebar
          createNewEncounter={createNew}
          handleClick={handleClick}
          items={historyItems}
          activeTitle={feedActive ? currentTitle : null}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteEncounter}
          button={"+ New Encounter"}
        />
      )}

      <RandomEncounter
        currentEncounter={currentEncounter}
        currentTitle={currentTitle}
        value1={value1}
        value2={value2}
        setValue1={setValue1}
        setValue2={setValue2}
        getMessages={getMessages}
        error={error}
        imageStatus={imageStatus}
        loading={loading}
        setLoading={setLoading}
        feedActive={feedActive}
        setFeedActive={setFeedActive}
        encounter={encounter}
        images={images}
        imageGenerator={imageGenerator}
        setImages={setImages}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        toggleVisibility={toggleVisibility}
      />
    </React.Fragment>
  );
};

export default RandomEncounterPage;
