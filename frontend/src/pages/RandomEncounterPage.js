import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React, { useState, useEffect } from "react";
import RandomEncounter from "../Components/RandomEncounter/RandomEncounter";

const RandomEncounterPage = () => {
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedActive, setFeedActive] = useState(false);

  const createNew = () => {
    setMessage(null);
    setValue1("");
    setValue2("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue1("");
    setValue2("");
  };

  const getMessages = async () => {
    console.log(value1);

    try {
      const firstResponse = await fetch(
        `http://localhost:4000/app/encounter?location=${value1}&challengeRating=${value2}`
      );
      const firstData = await firstResponse.json();
      console.log(firstData);
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: `Generate a detailed encounter description involving the following monsters: ${firstData}. Describe the setting, the actions of the monsters, and any potential challenges or interactions the player characters might face during this encounter.`,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const secondResponse = await fetch(
        "http://localhost:4000/app/completions",
        options
      );
      const data = await secondResponse.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value1, message);
    if (!currentTitle && value1 && message) {
      setCurrentTitle(value1);
    }
    if (currentTitle && value1 && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value1,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  console.log(previousChats);

  const currentEncounter = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title).reverse())
  );
  console.log(uniqueTitles);

  return (
    <React.Fragment>
      <Sidebar
        createNewEncounter={createNew}
        handleClick={handleClick}
        uniqueTitles={uniqueTitles}
        button={"+ New Encounter"}
      />
      <RandomEncounter
        currentEncounter={currentEncounter}
        value1={value1}
        value2={value2}
        setValue1={setValue1}
        setValue2={setValue2}
        getMessages={getMessages}
        loading={loading}
        setLoading={setLoading}
        feedActive={feedActive}
        setFeedActive={setFeedActive}
      />
    </React.Fragment>
  );
};

export default RandomEncounterPage;
