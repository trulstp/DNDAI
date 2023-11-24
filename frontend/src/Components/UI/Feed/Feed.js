import React, { useRef } from "react";

import Button from "../Buttons/Button";
import classes from "./Feed.module.css";

const Feed = (props) => {
  const feedContainerRef = useRef(null);

  return (
    <div className={`${classes.feed}`} ref={feedContainerRef}>
      {props.currentEncounter?.map((chatMessage, index) => (
        <div>
          <h1 onClick={() => props.toggleVisibility("images")}>
            {chatMessage.content.title}
          </h1>
          <div key={index} className={classes["section-container"]}>
            {props.isVisible.images &&
              (chatMessage.images || props.images) &&
              (chatMessage.images || props.images).map((image, index) => (
                <section
                  className={classes.section}
                  onClick={() => props.toggleVisibility("images")}
                >
                  <img
                    className={` ${classes.image}`}
                    loading='lazy'
                    key={index}
                    src={image.url}
                    alt={chatMessage.content.title}
                  />
                </section>
              ))}
            {!chatMessage.images && !props.images && (
              <section className={classes.section}>
                <h2>Image</h2>
                <div className={classes["image-button"]}>
                  <Button onClick={() => props.imageGenerator()}>
                    Generate Image?
                  </Button>
                </div>
              </section>
            )}

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("location")}
            >
              <h2 className={classes.heading}>Location</h2>
              {props.isVisible.location && (
                <p className={classes.paragraph}>
                  {chatMessage.content.location}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("mood_atmosphere")}
            >
              <h2 className={classes.heading}>Mood and Atmosphere</h2>
              {props.isVisible.mood_atmosphere && (
                <p className={classes.paragraph}>
                  {chatMessage.content.mood_atmosphere}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("monsters")}
            >
              <h2 className={classes.heading}>Monsters</h2>
              {props.isVisible.monsters && (
                <p className={classes.paragraph}>
                  {chatMessage.content.monsters}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("obstacles")}
            >
              <h2 className={classes.heading}>Obstacles</h2>
              {props.isVisible.obstacles && (
                <p className={classes.paragraph}>
                  {chatMessage.content.obstacles}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("allies_npcs")}
            >
              <h2 className={classes.heading}>Allied NPCs</h2>
              {props.isVisible.allies_npcs && (
                <p className={classes.paragraph}>
                  {chatMessage.content.allies_npcs}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("treasure_rewards")}
            >
              <h2 className={classes.heading}>Treasure</h2>
              {props.isVisible.treasure_rewards && (
                <p className={classes.paragraph}>
                  {chatMessage.content.treasure_rewards}
                </p>
              )}
            </section>

            <section
              className={classes.section}
              onClick={() => props.toggleVisibility("random_events_twists")}
            >
              <h2 className={classes.heading}>Random Twists</h2>
              {props.isVisible.random_events_twists && (
                <p className={classes.paragraph}>
                  {chatMessage.content.random_events_twists}
                </p>
              )}
            </section>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
