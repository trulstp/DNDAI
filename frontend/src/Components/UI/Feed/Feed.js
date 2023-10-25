import React, { useEffect, useRef, useState } from "react";
import Button from "../Buttons/Button";
import classes from "./Feed.module.css";

const Feed = (props) => {
  const feedContainerRef = useRef(null);

  const [images, setImages] = useState(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [props.currentEncounter]);

  const scrollToBottom = () => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop =
        feedContainerRef.current.scrollHeight;
    }
  };

  const imageGenerator = async () => {
    try {
      const currentDescription =
        props.currentEncounter[0]?.content?.poster_description;
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
      console.log(data);
      if (Array.isArray(data) && data.length > 0) {
        setImages(data);
      } else {
        console.error("Invalid image data received");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={classes.feed} ref={feedContainerRef}>
      {props.currentEncounter?.map((chatMessage, index) => (
        <div key={index}>
          <section>
            <p className={classes.role}>{chatMessage.role}</p>
            <h1>{chatMessage.content.title}</h1>
          </section>
          {!images && (
            <Button onClick={() => imageGenerator()}>Generate Image?</Button>
          )}
          {images &&
            images.map((image, index) => (
              <img
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
