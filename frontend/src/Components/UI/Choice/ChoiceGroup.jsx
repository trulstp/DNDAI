import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "./Choice.module.css";

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREVIOUS_KEYS = ["ArrowLeft", "ArrowUp"];

// Single-choice options shown as chips or tiles, working like a radio group: the group is one
// Tab stop (the selected option, or the first one), and the arrow keys move and select
const ChoiceGroup = ({ label, options, value, onChange, variant = "chip" }) => {
  const buttons = useRef([]);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const select = (index) => {
    onChange(options[index].value);
    buttons.current[index]?.focus();
  };

  const onKeyDown = (event, index) => {
    const last = options.length - 1;
    let next;
    if (NEXT_KEYS.includes(event.key)) next = index === last ? 0 : index + 1;
    else if (PREVIOUS_KEYS.includes(event.key))
      next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    select(next);
  };

  return (
    <div
      role='radiogroup'
      aria-label={label}
      className={variant === "tile" ? classes.tiles : classes.chips}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            type='button'
            role='radio'
            aria-checked={selected}
            tabIndex={index === tabbableIndex ? 0 : -1}
            ref={(element) => (buttons.current[index] = element)}
            key={option.value}
            className={`${classes[variant]} ${selected ? classes.selected : ""}`}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
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
};

export default ChoiceGroup;
