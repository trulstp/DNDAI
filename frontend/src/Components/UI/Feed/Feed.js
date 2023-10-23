import React, { useEffect, useRef } from "react";
import classes from "./Feed.module.css";

const Feed = (props) => {
  const feedContainerRef = useRef(null);

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

  return (
    <div className={classes.feed} ref={feedContainerRef}>
      <ul>
        {props.currentEncounter?.map((chatMessage, index) => (
          <li key={index}>
            <p className={classes.role}>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;
