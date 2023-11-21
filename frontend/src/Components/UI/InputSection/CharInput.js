// CharInput.js
import React from "react";
import {
  raceOptions,
  classTypeOptions,
  levelOptions,
} from "../../Arrays/options"; // Import the options

import FormSelect from "../Select/FormSelect";
import Button from "../Buttons/Button";
import classes from "./CharInput.module.css";

const CharInput = (props) => {
  return (
    <div className={classes.inputcontainer}>
      <div>
        <input
          className={classes.CharInput}
          placeholder='Character Name'
          onChange={(e) => props.handleChange("name", e.target.value)}
        />
        <FormSelect
          className={classes.CharSelect}
          options={raceOptions}
          value={props.selections.race.value}
          onChange={(option) => props.handleChange("race", option.value)}
          isMulti={false}
          placeholder='Select Race'
        />
        <FormSelect
          className={classes.CharSelect}
          options={classTypeOptions}
          value={props.selections.classType.value}
          onChange={(option) => props.handleChange("classType", option.value)}
          placeholder='Select Class'
          isMulti={false}
        />

        <FormSelect
          className={classes.CharSelect}
          options={levelOptions}
          value={props.selections.level.value}
          onChange={(option) => props.handleChange("level", option.value)}
          isMulti={false}
          placeholder='Select Level'
        />
        <Button onClick={() => props.getCharacter(props.selections)}>
          Create Character
        </Button>
      </div>
    </div>
  );
};

export default CharInput;
