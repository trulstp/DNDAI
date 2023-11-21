import React from "react";
import classes from "./RandomEncounter.module.css";
import Feed from "../UI/Feed/Feed";
import InputSection from "../UI/InputSection/InputSection";
import Loading from "../UI/Loading/Loading";

const RandomEncounter = (props) => {
  const formatMonsterList = (monsters) => {
    if (!monsters || monsters.length === 0) {
      return "";
    }

    const monsterCount = {};
    monsters.forEach((monster) => {
      monsterCount[monster] = (monsterCount[monster] || 0) + 1;
    });

    return Object.entries(monsterCount)
      .map(([monster, count]) => `${count} ${monster}${count > 1 ? "s" : ""}`)
      .join(", ");
  };

  const formattedEncounter = formatMonsterList(props.encounter);
  const loadingText =
    formattedEncounter.length > 0
      ? `An encounter of ${formattedEncounter} is being generated`
      : "An encounter is being generated";

  return (
    <section className={classes.main}>
      {props.loading ? (
        <Loading text={loadingText} />
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
