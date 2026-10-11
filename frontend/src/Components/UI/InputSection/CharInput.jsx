import React from "react";
import {
  faDiceD20,
  faHandsPraying,
  faHatWizard,
  faShieldHalved,
  faUserNinja,
} from "@fortawesome/free-solid-svg-icons";
import {
  raceOptions,
  classTypeOptions,
  levelOptions,
  raceHints,
  classHints,
} from "../../Arrays/options";
import ChoiceGroup from "../Choice/ChoiceGroup";
import { ErrorBanner } from "../Feedback/Feedback";
import classes from "../Choice/Choice.module.css";

// An empty value means random; the backend fills in anything left empty
const RANDOM = "";

const CLASS_ICONS = {
  Cleric: faHandsPraying,
  Fighter: faShieldHalved,
  Rogue: faUserNinja,
  Wizard: faHatWizard,
};

const raceChoices = [
  { value: RANDOM, label: "Random", hint: "Surprise me", icon: faDiceD20 },
  ...raceOptions.map(({ value, label }) => ({
    value,
    label,
    hint: raceHints[value],
  })),
];

const classChoices = [
  { value: RANDOM, label: "Random", hint: "Surprise me", icon: faDiceD20 },
  ...classTypeOptions.map(({ value, label }) => ({
    value,
    label,
    hint: classHints[value],
    icon: CLASS_ICONS[value],
  })),
];

const levelChoices = [
  { value: RANDOM, label: "Random", icon: faDiceD20 },
  ...levelOptions.map(({ value, label }) => ({
    value,
    label: `Level ${label}`,
  })),
];

const CharInput = ({ selections, handleChange, getCharacter, error }) => {
  const { name, race, classType, level } = selections;
  const summary = [
    name.trim() || "Random name",
    `${race || "random race"} ${classType || "random class"}`,
    level ? `Level ${level}` : "random level",
  ].join(" · ");

  return (
    <div className={classes.page}>
      <div className={classes.panel}>
        <h1 className={classes.title}>Create a Character</h1>

        <section className={classes.field}>
          {/* The visible heading is the field's label */}
          <h2 className={classes["field-label"]}>
            <label htmlFor='character-name'>Name</label>
          </h2>
          <input
            className={classes.input}
            placeholder='Leave empty for a random name'
            id='character-name'
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </section>

        <section className={classes.field}>
          <h2 className={classes["field-label"]}>Race</h2>
          <ChoiceGroup
            label='Race'
            variant='tile'
            options={raceChoices}
            value={race}
            onChange={(value) => handleChange("race", value)}
          />
        </section>

        <section className={classes.field}>
          <h2 className={classes["field-label"]}>Class</h2>
          <ChoiceGroup
            label='Class'
            variant='tile'
            options={classChoices}
            value={classType}
            onChange={(value) => handleChange("classType", value)}
          />
        </section>

        <section className={classes.field}>
          <h2 className={classes["field-label"]}>Level</h2>
          <ChoiceGroup
            label='Level'
            options={levelChoices}
            value={level}
            onChange={(value) => handleChange("level", value)}
          />
        </section>

        {error && <ErrorBanner message={error} onRetry={getCharacter} />}

        <div className={classes.summary}>
          <span className={classes["summary-text"]}>{summary}</span>
          <button
            type='button'
            className={classes.primary}
            onClick={getCharacter}
          >
            Create Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharInput;
