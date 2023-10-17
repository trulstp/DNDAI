import classes from "./Sidebar.module.css";
import React from "react";

const Sidebar = (props) => {
  return (
    <section className={classes["side-bar"]}>
      <button onClick={props.createNew}>{props.button}</button>
      <ul className={classes.history}>
        {props.uniqueTitles?.map((uniqueTitle, index) => (
          <li key={index} onClick={() => props.handleClick(uniqueTitle)}>
            {uniqueTitle}
          </li>
        ))}
      </ul>
      <nav>
        <p>Made by Truls</p>
      </nav>
    </section>
  );
};

export default Sidebar;
