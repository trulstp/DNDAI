import React from "react";
import classes from "./RandomEncounter.module.css";
import Feed from "../UI/Feed/Feed";
import InputSection from "../UI/InputSection/InputSection";
import Loading from "../UI/Loading/Loading"; // Import your Loading component

const RandomEncounter = (props) => {
  return (
    <section className={classes.main}>
      {props.loading ? (
        <Loading encounter={props.encounter} />
      ) : (
        <>
          {props.feedActive && (
            <Feed
              currentEncounter={props.currentEncounter}
              images={props.images}
              setImages={props.setImages}
              imageGenerator={props.imageGenerator}
              isVisible={props.isVisible}
              setIsVisible={props.setIsVisible}
              toggleVisibility={props.toggleVisibility}
            />
          )}
          {!props.feedActive && (
            <InputSection
              value1={props.value1}
              value2={props.value2}
              setValue1={props.setValue1}
              setValue2={props.setValue2}
              getMessages={props.getMessages}
            />
          )}
        </>
      )}
    </section>
  );
};

export default RandomEncounter;

//  {!props.currentTitle && <h1>DNDAI</h1>}
//       <div className={classes["picture-section"]}></div>
