import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import CharacterSheet from "../Components/UI/Feed/CharacterSheet";
import Loading from "../Components/UI/Loading/Loading";
import CharInput from "../Components/UI/InputSection/CharInput";
import { SidebarContext } from "../store/sidebar-context";
import { blobToDataUrl } from "../util/blobToDataUrl";
import { fetchOk } from "../util/fetchOk";
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const CharacterCreatorPage = () => {
  const sidebarCtx = useContext(SidebarContext);
  const { previousChats, setPreviousChats } = sidebarCtx; // Use from context
  const [selections, setSelections] = useState({
    name: "",
    race: "",
    classType: "",
    level: "",
  });
  const [message, setMessage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charInfo1, setCharInfo1] = useState("");
  const [feedActive, setFeedActive] = useState(false);
  const [images, setImages] = useState(null);
  const [charInfo2, setCharInfo2] = useState("");
  const [error, setError] = useState(null);
  const [imageStatus, setImageStatus] = useState({ state: "idle" });

  const handleChange = (field, value) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  const createNew = () => {
    setError(null);
    setImageStatus({ state: "idle" });
    setFeedActive(false);
    setLoading(false);
    setMessage(null);
    setSelections({
      name: "",
      race: "",
      classType: "",
      level: "",
    });
    setCurrentTitle(null);
    setImages(null);
  };

  const imageGenerator = async () => {
    try {
      const currentDescription = currentEncounter.second.character_portrait;
      if (!currentDescription) {
        console.error("Poster description not found");
        return;
      }

      const options = {
        method: "POST",
        body: JSON.stringify({
          message: currentDescription,
          race: currentEncounter.first?.Race,
          characterClass: currentEncounter.first?.Class,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      setImageStatus({ state: "loading" });
      const response = await fetchOk(`${API}/app/images2`, options);
      const imageUrl = await blobToDataUrl(await response.blob());

      // Update the state with the new image URL
      setImages([imageUrl]);
      setPreviousChats((prevChats) =>
        prevChats.map((chat) =>
          chat.title === currentTitle ? { ...chat, images: [imageUrl] } : chat
        )
      );
      setImageStatus({ state: "idle" });
    } catch (error) {
      console.error("Error in image generation:", error);
      setImageStatus({ state: "error", message: error.message });
    }
  };

  const getCharacter = async () => {
    setError(null);
    setLoading(true);
    try {
      const options1 = {
        method: "POST",
        body: JSON.stringify(selections),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const firstResponse = await fetchOk(
        `${API}/app/create-character`,
        options1
      );
      const firstData = await firstResponse.json();
      setCharInfo1(firstData);

      const options = {
        method: "POST",
        body: JSON.stringify({
          message: {
            name: firstData.Name || "", // Fallback to an empty string if undefined
            class: firstData.Class || "",
            race: firstData.Race || "",
            level: firstData.Level || "",
            alignment: firstData.Alignment || "",
            stats: firstData.Stats || "",
            skills: firstData.Skills || "",
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const secondResponse = await fetchOk(
        `${API}/app/openaiCharacter`,
        options
      );
      const data = await secondResponse.json();
      setCharInfo2(data);
      setMessage(data);
      setFeedActive(true);
    } catch (error) {
      console.error("Error creating character:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message && !currentTitle) {
      const newTitle = `${charInfo1.Name} the ${charInfo1.Race} ${charInfo1.Class}`;
      setCurrentTitle(newTitle);

      const newCharacter = {
        title: newTitle,
        first: charInfo1,
        second: charInfo2,
        images: [],
      };

      setPreviousChats((prevChats) => {
        const existingCharacter = prevChats.find(
          (chat) => chat.title === newTitle
        );
        if (!existingCharacter) {
          return [...prevChats, newCharacter];
        }
        return prevChats;
      });

      setFeedActive(true);
    }
  }, [message, currentTitle, charInfo1, charInfo2, setPreviousChats]); // Add setPreviousChats as a dependency

  const handleSidebarClick = (uniqueTitle) => {
    const selectedCharacter = previousChats.find(
      (chat) => chat.title === uniqueTitle
    );
    if (selectedCharacter) {
      setError(null);
      setImageStatus({ state: "idle" });
      setCurrentTitle(uniqueTitle);
      setMessage(selectedCharacter);
      setCharInfo1(selectedCharacter.first);
      setCharInfo2(selectedCharacter.second);
      setImages(selectedCharacter.images || null); // Ensure images are updated
      setFeedActive(true);
    }
  };

  // Opened from the home page's Recent list: show that character, then clear the request
  // so a reload doesn't reopen it
  const location = useLocation();
  const navigate = useNavigate();
  const openTitle = location.state?.openTitle;
  useEffect(() => {
    if (!openTitle) return;
    handleSidebarClick(openTitle);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTitle]);

  const currentEncounter =
    previousChats.find((chat) => chat.title === currentTitle) || {};

  // Sidebar items, newest first, one per title
  const historyItems = [];
  for (const chat of [...previousChats].reverse()) {
    if (!historyItems.some((item) => item.title === chat.title)) {
      historyItems.push({ title: chat.title, favorite: !!chat.favorite });
    }
  }

  const toggleFavorite = (title) => {
    setPreviousChats((prev) => {
      const favorite = !prev.some((c) => c.title === title && c.favorite);
      return prev.map((c) => (c.title === title ? { ...c, favorite } : c));
    });
  };

  const deleteCharacter = (title) => {
    setPreviousChats((prev) => prev.filter((c) => c.title !== title));
    if (title === currentTitle) createNew();
  };

  return (
    <>
      {sidebarCtx.sidebarOpen && (
        <Sidebar
          createNewEncounter={createNew}
          handleClick={handleSidebarClick}
          button='+ New Character'
          items={historyItems}
          activeTitle={feedActive ? currentTitle : null}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteCharacter}
        />
      )}

      {loading ? (
        <Loading text='Generating Character' />
      ) : feedActive ? (
        <CharacterSheet
          characterData={currentEncounter}
          imageGenerator={imageGenerator}
          imageStatus={imageStatus}
          images={images}
        />
      ) : (
        <CharInput
          getCharacter={getCharacter}
          handleChange={handleChange}
          selections={selections}
          error={error}
        />
      )}
    </>
  );
};

export default CharacterCreatorPage;
