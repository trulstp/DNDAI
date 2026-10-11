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
      const name = monster.monsterName ?? monster;
      monsterCount[name] = (monsterCount[name] || 0) + 1;
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
              imageGenerator={props.imageGenerator}
              imageStatus={props.imageStatus}
              isVisible={props.isVisible}
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
              error={props.error}
            />
          )}
        </>
      )}
    </section>
  );
};

export default RandomEncounter;
