import React, { useRef } from "react";
import Button from "../Buttons/Button";
import classes from "./Feed.module.css";

const Feed = (props) => {
  const feedContainerRef = useRef(null);
  console.log("testing again" + props.currentEncounter);
  return (
    <div className={classes.feed} ref={feedContainerRef}>
      {props.currentEncounter?.map((chatMessage, index) => (
        <div key={index}>
          <section>
            <p className={classes.role}>{chatMessage.role}</p>
            <h1>{chatMessage.content.title}</h1>
          </section>
          {!props.images && (
            <Button onClick={() => props.imageGenerator()}>
              Generate Image?
            </Button>
          )}
          {props.images &&
            props.images.map((image, index) => (
              <img
                loading='lazy'
                key={index}
                src={image.url}
                alt={chatMessage.content.title}
              />
            ))}

          <section className={classes.section}>
            <h2 className={classes.heading}>Location</h2>
            <p className={classes.paragraph}>{chatMessage.content.location}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.heading}>Monsters</h2>
            <p className={classes.paragraph}>{chatMessage.content.monsters}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.heading}>Scene</h2>
            <p className={classes.paragraph}>{chatMessage.content.scene}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.heading}>Gear</h2>
            <p className={classes.paragraph}>{chatMessage.content.gear}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.heading}>Treasure</h2>
            <p className={classes.paragraph}>{chatMessage.content.treasure}</p>
          </section>

          <section className={classes.section}>
            <h2 className={classes.heading}>Magical Items</h2>
            <p className={classes.paragraph}>
              {chatMessage.content.magical_items}
            </p>
          </section>
        </div>
      ))}
    </div>
  );
};

export default Feed;
