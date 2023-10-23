import React from "react";
import classes from "./RandomEncounter.module.css";
import Feed from "../UI/Feed/Feed";
import InputSection from "../UI/InputSection/InputSection";

const RandomEncounter = (props) => {
  return (
    <section className={classes.main}>
      {!props.currentTitle && <h1>DNDAI</h1>}
      <div className={classes["picture-section"]}></div>
      <Feed currentEncounter={props.currentEncounter} />
      <InputSection
        value1={props.value1}
        value2={props.value2}
        setValue1={props.setValue1}
        setValue2={props.setValue2}
        getMessages={props.getMessages}
      />
    </section>
  );
};

export default RandomEncounter;
