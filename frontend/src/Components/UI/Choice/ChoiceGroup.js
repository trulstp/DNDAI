import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Choice.module.css";

// Single-choice options shown as buttons, either compact chips or larger tiles with a hint
const ChoiceGroup = ({ label, options, value, onChange, variant = "chip" }) => (
  <div
    role='group'
    aria-label={label}
    className={variant === "tile" ? classes.tiles : classes.chips}
  >
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          type='button'
          key={option.value}
          className={`${classes[variant]} ${selected ? classes.selected : ""}`}
          aria-pressed={selected}
          onClick={() => onChange(option.value)}
        >
          {option.icon && (
            <FontAwesomeIcon icon={option.icon} className={classes.icon} />
          )}
          <span className={classes.optionLabel}>{option.label}</span>
          {option.hint && <span className={classes.hint}>{option.hint}</span>}
        </button>
      );
    })}
  </div>
);

export default ChoiceGroup;
