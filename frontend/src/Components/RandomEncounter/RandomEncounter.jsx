import React from "react";
import classes from "./RandomEncounter.module.css";
import Feed from "../UI/Feed/Feed";
import InputSection from "../UI/InputSection/InputSection";
import Loading from "../UI/Loading/Loading";
import { summariseMonsters, titleCase } from "../../util/format";

const RandomEncounter = (props) => {
  const { pending } = props;

  return (
    <section className={classes.main}>
      {props.loading ? (
        <Loading
          title='Rolling your encounter…'
          details={[
            pending &&
              `${titleCase(pending.location)} · CR ${pending.challengeRating}`,
            summariseMonsters(props.encounter || []),
          ]}
        />
      ) : (
        <>
          {props.feedActive && (
            <Feed
              currentEncounter={props.currentEncounter}
              imageGenerator={props.imageGenerator}
              imageStatus={props.imageStatus}
              isVisible={props.isVisible}
              toggleVisibility={props.toggleVisibility}
              onNew={props.onNew}
              onReroll={props.onReroll}
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
