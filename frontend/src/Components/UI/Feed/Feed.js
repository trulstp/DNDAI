import React, { useEffect, useRef } from "react";

import { GenerateImageButton } from "../Feedback/Feedback";
import ResultActions from "../Choice/ResultActions";
import { titleCase } from "../../../util/format";
import MonsterList from "./MonsterList";
import { CardText, CollapsibleCard } from "../Collapsible/Collapsible";
import classes from "./Feed.module.css";

const TOP_SECTIONS = [
  ["location", "Location"],
  ["mood_atmosphere", "Mood and Atmosphere"],
];

const BOTTOM_SECTIONS = [
  ["obstacles", "Obstacles"],
  ["allies_npcs", "Allied NPCs"],
  ["treasure_rewards", "Treasure"],
  ["random_events_twists", "Random Twists"],
];

const Section = ({ title, text, isVisible, onToggle, children }) => (
  <CollapsibleCard title={title} isOpen={isVisible} onToggle={onToggle}>
    {text && <CardText>{text}</CardText>}
    {children}
  </CollapsibleCard>
);

// "Underdark · CR 12 · 5 monsters"; older saved encounters only know their monsters
const encounterSummary = (entry) =>
  [
    entry.location && titleCase(entry.location),
    entry.challengeRating && `CR ${entry.challengeRating}`,
    entry.monsterList?.length &&
      `${entry.monsterList.length} ${entry.monsterList.length === 1 ? "monster" : "monsters"}`,
  ]
    .filter(Boolean)
    .join(" · ");

const Feed = (props) => {
  const sectionProps = (field) => ({
    isVisible: props.isVisible[field],
    onToggle: () => props.toggleVisibility(field),
  });

  // A different encounter starts at the top, not at the previous one's scroll position
  const feedRef = useRef(null);
  const entryId = props.currentEncounter?.[0]?.id;
  useEffect(() => {
    feedRef.current?.scrollIntoView({ block: "start" });
  }, [entryId]);

  return (
    <div className={classes.feed} ref={feedRef}>
      {props.currentEncounter?.map((chatMessage, index) => {
        const content = chatMessage.content;
        const images = chatMessage.images;

        return (
          <article key={index} className={classes.encounter}>
            <header className={classes.header}>
              <h1 className={classes.title}>{content.title}</h1>
              {encounterSummary(chatMessage) && (
                <p className={classes.summary}>
                  {encounterSummary(chatMessage)}
                </p>
              )}
              <ResultActions
                newLabel='New encounter'
                onNew={props.onNew}
                onReroll={props.onReroll}
                rerollHint={
                  props.onReroll &&
                  `Roll a new ${titleCase(chatMessage.location)} encounter at CR ${chatMessage.challengeRating}`
                }
              />
            </header>

            <div className={classes.top}>
              <div className={classes.media}>
                {images?.length ? (
                  images.map((image, imageIndex) => (
                    <img
                      key={imageIndex}
                      className={classes.image}
                      loading='lazy'
                      src={image}
                      alt={content.title}
                    />
                  ))
                ) : (
                  <div className={classes.placeholder}>
                    <p>No artwork for this encounter yet.</p>
                    <GenerateImageButton
                      status={props.imageStatus}
                      onGenerate={props.imageGenerator}
                    />
                  </div>
                )}
              </div>

              <div className={classes.stack}>
                {TOP_SECTIONS.map(([field, title]) => (
                  <Section
                    key={field}
                    title={title}
                    text={content[field]}
                    {...sectionProps(field)}
                  />
                ))}
              </div>
            </div>

            <Section
              title='Monsters'
              text={content.monsters}
              {...sectionProps("monsters")}
            >
              {/* Older saved encounters have no monster list */}
              {chatMessage.monsterList?.length > 0 && (
                <MonsterList
                  key={chatMessage.monsterList
                    .map((monster) => monster.monsterName)
                    .join(",")}
                  monsters={chatMessage.monsterList}
                  isVisible={props.isVisible.stat_blocks}
                  toggleVisibility={() => props.toggleVisibility("stat_blocks")}
                />
              )}
            </Section>

            <div className={classes.grid}>
              {BOTTOM_SECTIONS.map(([field, title]) => (
                <Section
                  key={field}
                  title={title}
                  text={content[field]}
                  {...sectionProps(field)}
                />
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Feed;
