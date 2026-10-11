import React from "react";

import Button from "../Buttons/Button";
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

const Feed = (props) => {
  const sectionProps = (field) => ({
    isVisible: props.isVisible[field],
    onToggle: () => props.toggleVisibility(field),
  });

  return (
    <div className={classes.feed}>
      {props.currentEncounter?.map((chatMessage, index) => {
        const content = chatMessage.content;
        const images = chatMessage.images || props.images;

        return (
          <article key={index} className={classes.encounter}>
            <h1 className={classes.title}>{content.title}</h1>

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
                    <Button onClick={() => props.imageGenerator()}>
                      Generate Image?
                    </Button>
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
