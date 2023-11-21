import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React, { useState, useEffect, useContext } from "react";
import RandomEncounter from "../Components/RandomEncounter/RandomEncounter";
import { SidebarContext } from "../store/sidebar-context";

const RandomEncounterPage = () => {
  const sidebarCtx = useContext(SidebarContext);

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [encounter, setEncounter] = useState("");
  const [feedActive, setFeedActive] = useState(false);
  const [images, setImages] = useState(null);
  const [isVisible, setIsVisible] = useState({
    images: true,
    location: true,
    monsters: true,
    scene: true,
    gear: true,
    treasure: true,
    magicalItems: true,
  });

  const createNew = () => {
    setFeedActive(false);
    setLoading(false);
    setMessage(null);
    setValue1("");
    setValue2("");
    setCurrentTitle(null);
    setImages(null);
  };

  const handleClick = (uniqueTitle) => {
    setFeedActive(true);
    setLoading(false);
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue1("");
    setValue2("");
    setImages(null);
    console.log(feedActive);
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
      const response = await fetch("http://localhost:4000/app/images", options);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setImages(data);
        setPreviousChats((prevChats) =>
          prevChats.map((chat) =>
            chat.title === currentTitle ? { ...chat, images: data } : chat
          )
        );
      } else {
        console.error("Invalid image data received");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMessages = async () => {
    console.log(value1);

    try {
      const firstResponse = await fetch(
        `http://localhost:4000/app/encounter?location=${value1}&challengeRating=${value2}`
      );
      if (!firstResponse.ok) throw new Error("First fetch failed");
      const firstData = await firstResponse.json();
      setLoading(true);
      setEncounter(firstData);
      console.log(firstData);

      const options = {
        method: "POST",
        body: JSON.stringify({
          message: {
            monsters: firstData,
            location: value1,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const secondResponse = await fetch(
        "http://localhost:4000/app/schematic",
        options
      );
      if (!secondResponse.ok) throw new Error("Second fetch failed");
      const data = await secondResponse.json();

      console.log("testing", data);
      // Check if the response has the expected structure
      if (data && typeof data === "object" && "title" in data) {
        setMessage(data);
        setFeedActive(true);
      } else {
        throw new Error("Unexpected data structure from second fetch");
      }
    } catch (error) {
      console.error("Error here?", error);
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
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: message.role,
          content: message,
        },
      ]);
    }
  }, [currentTitle, message]);

  console.log(previousChats);

  const currentEncounter = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title).reverse())
  );

  const toggleVisibility = (section) => {
    setIsVisible((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <React.Fragment>
      {sidebarCtx.sidebarOpen && (
        <Sidebar
          createNewEncounter={createNew}
          handleClick={handleClick}
          uniqueTitles={uniqueTitles}
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

// `Generate a detailed encounter description involving the following monsters: ${firstData}.
//           It takes place in the environment ${value1}. Describe the setting, the actions of the monsters,
//           and any potential challenges or interactions the player characters might face during this encounter.`,
