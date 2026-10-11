import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20, faPlus } from "@fortawesome/free-solid-svg-icons";
import classes from "./Choice.module.css";

// Next steps after a result: start over, or roll again with the same choices
const ResultActions = ({ newLabel, onNew, onReroll, rerollHint }) => (
  <div className={classes["result-actions"]}>
    <button type='button' className={classes.secondary} onClick={onNew}>
      <FontAwesomeIcon icon={faPlus} className={classes.icon} />
      {newLabel}
    </button>
    {onReroll && (
      <button
        type='button'
        className={classes.secondary}
        onClick={onReroll}
        title={rerollHint}
      >
        <FontAwesomeIcon icon={faDiceD20} className={classes.icon} />
        Reroll
      </button>
    )}
  </div>
);

export default ResultActions;
