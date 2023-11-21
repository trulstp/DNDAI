import React from "react";
import classes from "./Card.module.css"; // Make sure to create this CSS file

const Card = ({ children }) => {
  return <div className={classes.card}>{children}</div>;
};

export default Card;
