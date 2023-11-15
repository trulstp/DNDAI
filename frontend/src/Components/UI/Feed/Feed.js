import React, { useRef, useContext } from "react";
import { SidebarContext } from "../../../store/sidebar-context";
import Button from "../Buttons/Button";
import classes from "./Feed.module.css";

const Feed = (props) => {
  const feedContainerRef = useRef(null);

  const { sidebarOpen } = useContext(SidebarContext);

  const feedClass = !sidebarOpen ? "section-container" : "";

  return (
    <div className={`${classes.feed}`} ref={feedContainerRef}>
      {props.currentEncounter?.map((chatMessage, index) => (
        <div key={index} className={classes[feedClass]}>
          <section>
            <p className={classes.role}>{chatMessage.role}</p>
            <h1 onClick={() => props.toggleVisibility("images")}>
              {chatMessage.content.title}
            </h1>
          </section>
          {props.isVisible.images &&
            (chatMessage.images || props.images) &&
            (chatMessage.images || props.images).map((image, index) => (
              <img
                className={` ${classes.image} ${classes[feedClass]}`}
                loading='lazy'
                key={index}
                src={image.url}
                alt={chatMessage.content.title}
              />
            ))}
          {!chatMessage.images && !props.images && (
            <Button onClick={() => props.imageGenerator()}>
              Generate Image?
            </Button>
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
            onClick={() => props.toggleVisibility("scene")}
          >
            <h2 className={classes.heading}>Scene</h2>
            {props.isVisible.scene && (
              <p className={classes.paragraph}>{chatMessage.content.scene}</p>
            )}
          </section>

          <section
            className={classes.section}
            onClick={() => props.toggleVisibility("gear")}
          >
            <h2 className={classes.heading}>Gear</h2>
            {props.isVisible.gear && (
              <p className={classes.paragraph}>{chatMessage.content.gear}</p>
            )}
          </section>

          <section
            className={classes.section}
            onClick={() => props.toggleVisibility("treasure")}
          >
            <h2 className={classes.heading}>Treasure</h2>
            {props.isVisible.treasure && (
              <p className={classes.paragraph}>
                {chatMessage.content.treasure}
              </p>
            )}
          </section>

          <section
            className={`${classes.section} ${classes["last-section"]}`}
            onClick={() => props.toggleVisibility("magicalItems")}
          >
            <h2 className={classes.heading}>Magical Items</h2>
            {props.isVisible.magicalItems && (
              <p className={classes.paragraph}>
                {chatMessage.content.magical_items}
              </p>
            )}
          </section>
        </div>
      ))}
    </div>
  );
};

export default Feed;
