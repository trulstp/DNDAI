import classes from "./Sidebar.module.css";
import Button from "../Buttons/Button";
import React from "react";

const Sidebar = (props) => {
  return (
    <section className={classes["side-bar"]}>
      <Button onClick={props.createNewEncounter}>{props.button}</Button>
      <ul className={classes.history}>
        {props.uniqueTitles?.map((uniqueTitle, index) => (
          <li key={index} onClick={() => props.handleClick(uniqueTitle)}>
            {uniqueTitle}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
