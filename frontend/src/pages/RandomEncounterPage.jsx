import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RandomEncounter from "../Components/RandomEncounter/RandomEncounter";
import { SidebarContext } from "../store/sidebar-context";
import { blobToDataUrl } from "../util/blobToDataUrl";
import { fetchOk } from "../util/fetchOk";
import { newId } from "../util/newId";
import { preferredImageFormat } from "../util/imageFormat";
import { useDocumentTitle } from "../util/useDocumentTitle";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const RandomEncounterPage = () => {
  const sidebarCtx = useContext(SidebarContext);
  const { previousEncounter, setPreviousEncounter } = sidebarCtx;
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [encounter, setEncounter] = useState("");
  const [feedActive, setFeedActive] = useState(false);
  const [error, setError] = useState(null);
  // The location and CR being rolled right now, shown on the loading screen
  const [pending, setPending] = useState(null);
  // Tied to the encounter it was started for, so switching encounters mid-generation can't mix them up
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

  const currentEntry = previousEncounter.find(
    (entry) => entry.id === currentId,
  );

  useDocumentTitle(
    loading
      ? "Rolling encounter…"
      : feedActive && currentEntry
        ? currentEntry.title
        : "Random Encounter",
  );

  const createNew = () => {
    setError(null);
    setFeedActive(false);
    setLoading(false);
    setValue1("");
    setValue2("");
    setCurrentId(null);
  };

  const handleClick = (id) => {
    setError(null);
    setFeedActive(true);
    setLoading(false);
    setCurrentId(id);
    setValue1("");
    setValue2("");
  };

  const imageGenerator = async () => {
    const entry = currentEntry;
    const description = entry?.content?.poster_description;
    if (!description) {
      console.error("Poster description not found");
      return;
    }

    try {
      setImageStatus({ state: "loading", id: entry.id });
      const response = await fetchOk(`${API}/app/images`, {
        method: "POST",
        body: JSON.stringify({
          message: description,
          format: await preferredImageFormat(),
        }),
        headers: { "Content-Type": "application/json" },
      });
      const imageUrl = await blobToDataUrl(await response.blob());

      setPreviousEncounter((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, images: [imageUrl] } : e)),
      );
      setImageStatus({ state: "idle" });
    } catch (error) {
      console.error("Error in imageGenerator:", error);
      setImageStatus({ state: "error", message: error.message, id: entry.id });
    }
  };

  // Rolls the chosen location and CR, or the ones passed in (Reroll). Button clicks pass
  // an event, so anything without a location falls back to the current choices
  const getMessages = async (request) => {
    const { location, challengeRating } = request?.location
      ? request
      : { location: value1, challengeRating: value2 };
    setError(null);
    setPending({ location, challengeRating });
    setEncounter("");
    setLoading(true);
    try {
      const firstResponse = await fetchOk(
        `${API}/app/encounter?location=${encodeURIComponent(
          location,
        )}&challengeRating=${encodeURIComponent(challengeRating)}`,
      );
      const monsters = await firstResponse.json();
      if (monsters.length === 0) {
        throw new Error(
          "No monsters live in that location at this challenge rating. Try another combination.",
        );
      }
      setEncounter(monsters);

      const secondResponse = await fetchOk(`${API}/app/schematic`, {
        method: "POST",
        body: JSON.stringify({
          message: { monsters, location, challengeRating },
        }),
        headers: { "Content-Type": "application/json" },
      });
      const content = await secondResponse.json();
      if (!content || typeof content !== "object" || !("title" in content)) {
        throw new Error("The AI returned an incomplete encounter. Try again.");
      }

      const entry = {
        id: newId(),
        title: content.title,
        content,
        // Monsters rolled for this encounter, used for stat blocks
        monsterList: monsters,
        // What was asked for, shown with the encounter and reused by Reroll
        location,
        challengeRating,
      };
      setPreviousEncounter((prev) => [...prev, entry]);
      setCurrentId(entry.id);
      setFeedActive(true);
    } catch (error) {
      console.error("Error generating encounter:", error);
      setError(error.message);
      // The error and Try again live on the input screen, so show it (this matters after a Reroll)
      setFeedActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Sidebar items, newest first
  const historyItems = [...previousEncounter].reverse().map((entry) => ({
    id: entry.id,
    title: entry.title,
    favorite: !!entry.favorite,
  }));

  const toggleFavorite = (id) => {
    setPreviousEncounter((prev) =>
      prev.map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)),
    );
  };

  // Same location and CR as the encounter on screen; older saved encounters don't know theirs
  const reroll =
    currentEntry?.location && currentEntry?.challengeRating
      ? () => {
          setValue1(currentEntry.location);
          setValue2(String(currentEntry.challengeRating));
          getMessages({
            location: currentEntry.location,
            challengeRating: currentEntry.challengeRating,
          });
        }
      : undefined;

  const deleteEncounter = (id) => {
    setPreviousEncounter((prev) => prev.filter((e) => e.id !== id));
    if (id === currentId) createNew();
  };

  // Opened from the home page's Recent list: show that encounter, then clear the request
  // so a reload doesn't reopen it
  const location = useLocation();
  const navigate = useNavigate();
  const openId = location.state?.openId;
  useEffect(() => {
    if (!openId) return;
    if (previousEncounter.some((entry) => entry.id === openId)) {
      handleClick(openId);
    }
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  // The nav's Random Encounter link always leads to a fresh input screen, even from this page
  const resetRequest = location.state?.reset;
  useEffect(() => {
    if (!resetRequest) return;
    createNew();
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetRequest, location.key]);

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
          activeId={feedActive ? currentId : null}
          onToggleFavorite={toggleFavorite}
          onDelete={deleteEncounter}
          title='Encounter'
          button='New encounter'
        />
      )}

      <RandomEncounter
        currentEncounter={currentEntry ? [currentEntry] : []}
        value1={value1}
        value2={value2}
        setValue1={setValue1}
        setValue2={setValue2}
        getMessages={getMessages}
        error={error}
        imageStatus={
          imageStatus.id === currentId ? imageStatus : { state: "idle" }
        }
        loading={loading}
        pending={pending}
        feedActive={feedActive}
        encounter={encounter}
        onNew={createNew}
        onReroll={reroll}
        imageGenerator={imageGenerator}
        isVisible={isVisible}
        toggleVisibility={toggleVisibility}
      />
    </React.Fragment>
  );
};

export default RandomEncounterPage;
