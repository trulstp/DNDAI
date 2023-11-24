import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import CharacterSheet from "../Components/UI/Feed/CharacterSheet";
import Loading from "../Components/UI/Loading/Loading";
import CharInput from "../Components/UI/InputSection/CharInput";
import { SidebarContext } from "../store/sidebar-context";
import {
  raceOptions,
  classTypeOptions,
  levelOptions,
} from "../Components/Arrays/options";

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

  const handleChange = (field, value) => {
    setSelections({ ...selections, [field]: value });
  };

  const createNew = () => {
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
        body: JSON.stringify({ message: currentDescription }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        "https://dndai-785464cf00b0.herokuapp.com/app/images2",
        options
      );
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

  const getCharacter = async () => {
    try {
      const options1 = {
        method: "POST",
        body: JSON.stringify(selections),
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("Selections sent:", options1.body); // Make sure this contains the correct data

      const firstResponse = await fetch(
        `https://dndai-785464cf00b0.herokuapp.com/app/create-character`,
        options1
      );
      if (!firstResponse.ok) throw new Error("First fetch failed");
      const firstData = await firstResponse.json();
      console.log("First data received:", firstData);

      setLoading(true);
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
      console.log("Options sent:", options); // Make sure this contains the correct data

      const secondResponse = await fetch(
        "https://dndai-785464cf00b0.herokuapp.com/app/openaiCharacter",
        options
      );
      if (!secondResponse.ok) throw new Error("Second fetch failed");
      const data = await secondResponse.json();
      setCharInfo2(data);
      console.log("testing", data);
      setMessage(data);
      setFeedActive(true);
    } catch (error) {
      console.error("Error here?", error);
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
      setCurrentTitle(uniqueTitle);
      setMessage(selectedCharacter);
      setCharInfo1(selectedCharacter.first);
      setCharInfo2(selectedCharacter.second);
      setImages(selectedCharacter.images || null); // Ensure images are updated
      setFeedActive(true);
    }
  };

  const currentEncounter =
    previousChats.find((chat) => chat.title === currentTitle) || {};

  console.log("currentEncounter", currentEncounter);

  return (
    <>
      {sidebarCtx.sidebarOpen && (
        <Sidebar
          createNewEncounter={createNew}
          handleClick={handleSidebarClick}
          button='+ New Character'
          uniqueTitles={Array.from(
            new Set(previousChats.map((chat) => chat.title))
          )}
        />
      )}

      {loading ? (
        <Loading text='Generating Character' />
      ) : feedActive ? (
        <CharacterSheet
          characterData={currentEncounter}
          imageGenerator={imageGenerator}
          images={images}
        />
      ) : (
        <CharInput
          getCharacter={getCharacter}
          handleChange={handleChange}
          selections={selections}
        />
      )}
    </>
  );
};

export default CharacterCreatorPage;
