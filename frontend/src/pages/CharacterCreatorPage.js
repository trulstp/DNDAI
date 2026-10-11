import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/UI/Sidebar/Sidebar";
import CharacterSheet from "../Components/UI/Feed/CharacterSheet";
import Loading from "../Components/UI/Loading/Loading";
import CharInput from "../Components/UI/InputSection/CharInput";
import { SidebarContext } from "../store/sidebar-context";
import { blobToDataUrl } from "../util/blobToDataUrl";
import { fetchOk } from "../util/fetchOk";
import { newId } from "../util/newId";
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const EMPTY_SELECTIONS = { name: "", race: "", classType: "", level: "" };

const CharacterCreatorPage = () => {
  const sidebarCtx = useContext(SidebarContext);
  const { previousChats, setPreviousChats } = sidebarCtx; // Use from context
  const [selections, setSelections] = useState(EMPTY_SELECTIONS);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedActive, setFeedActive] = useState(false);
  const [error, setError] = useState(null);
  // Tied to the character it was started for, so switching characters mid-generation can't mix them up
  const [imageStatus, setImageStatus] = useState({ state: "idle" });

  const currentCharacter = previousChats.find((chat) => chat.id === currentId);

  const handleChange = (field, value) => {
    setSelections((prev) => ({ ...prev, [field]: value }));
  };

  const createNew = () => {
    setError(null);
    setFeedActive(false);
    setLoading(false);
    setSelections(EMPTY_SELECTIONS);
    setCurrentId(null);
  };

  const imageGenerator = async () => {
    const character = currentCharacter;
    const description = character?.second?.character_portrait;
    if (!description) {
      console.error("Portrait description not found");
      return;
    }

    try {
      setImageStatus({ state: "loading", id: character.id });
      const response = await fetchOk(`${API}/app/images2`, {
        method: "POST",
        body: JSON.stringify({
          message: description,
          race: character.first?.Race,
          characterClass: character.first?.Class,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const imageUrl = await blobToDataUrl(await response.blob());

      setPreviousChats((prev) =>
        prev.map((c) => (c.id === character.id ? { ...c, images: [imageUrl] } : c))
      );
      setImageStatus({ state: "idle" });
    } catch (error) {
      console.error("Error in image generation:", error);
      setImageStatus({ state: "error", message: error.message, id: character.id });
    }
  };

  const getCharacter = async () => {
    setError(null);
    setLoading(true);
    try {
      const firstResponse = await fetchOk(`${API}/app/create-character`, {
        method: "POST",
        body: JSON.stringify(selections),
        headers: { "Content-Type": "application/json" },
      });
      const first = await firstResponse.json();

      const secondResponse = await fetchOk(`${API}/app/openaiCharacter`, {
        method: "POST",
        body: JSON.stringify({
          message: {
            name: first.Name || "", // Fallback to an empty string if undefined
            class: first.Class || "",
            race: first.Race || "",
            level: first.Level || "",
            alignment: first.Alignment || "",
            stats: first.Stats || "",
            skills: first.Skills || "",
          },
        }),
        headers: { "Content-Type": "application/json" },
      });
      const second = await secondResponse.json();

      const character = {
        id: newId(),
        title: `${first.Name} the ${first.Race} ${first.Class}`,
        first,
        second,
        images: [],
      };
      setPreviousChats((prev) => [...prev, character]);
      setCurrentId(character.id);
      setFeedActive(true);
    } catch (error) {
      console.error("Error creating character:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSidebarClick = (id) => {
    if (previousChats.some((chat) => chat.id === id)) {
      setError(null);
      setCurrentId(id);
      setFeedActive(true);
    }
  };

  // Opened from the home page's Recent list: show that character, then clear the request
  // so a reload doesn't reopen it
  const location = useLocation();
  const navigate = useNavigate();
  const openId = location.state?.openId;
  useEffect(() => {
    if (!openId) return;
    handleSidebarClick(openId);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  // Sidebar items, newest first
  const historyItems = [...previousChats].reverse().map((chat) => ({
    id: chat.id,
    title: chat.title,
    favorite: !!chat.favorite,
  }));

  const toggleFavorite = (id) => {
    setPreviousChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  };

  const deleteCharacter = (id) => {
    setPreviousChats((prev) => prev.filter((c) => c.id !== id));
    if (id === currentId) createNew();
  };

  return (
    <>
      {sidebarCtx.sidebarOpen && (
        <Sidebar
          createNewEncounter={createNew}
          handleClick={handleSidebarClick}
          button='+ New Character'
          items={historyItems}
          activeId={feedActive ? currentId : null}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteCharacter}
        />
      )}

      {loading ? (
        <Loading text='Generating Character' />
      ) : feedActive ? (
        <CharacterSheet
          characterData={currentCharacter}
          imageGenerator={imageGenerator}
          imageStatus={
            imageStatus.id === currentId ? imageStatus : { state: "idle" }
          }
          images={currentCharacter?.images}
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
