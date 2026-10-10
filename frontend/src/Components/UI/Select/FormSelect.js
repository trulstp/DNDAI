import React from "react";
import Select from "react-select";
import classes from "./FormSelect.module.css";

// Theme colours from index.css, so the dropdowns follow light and dark mode
const themedStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--color-secondary)",
    borderColor: state.isFocused ? "var(--text-primary)" : "var(--color-tertiary)",
    boxShadow: "none",
    "&:hover": { borderColor: "var(--text-primary)" },
  }),
  singleValue: (base) => ({ ...base, color: "var(--text-secondary)" }),
  multiValue: (base) => ({ ...base, backgroundColor: "var(--color-tertiary)" }),
  multiValueLabel: (base) => ({ ...base, color: "var(--text-secondary)" }),
  input: (base) => ({ ...base, color: "var(--text-secondary)" }),
  placeholder: (base) => ({ ...base, color: "var(--text-muted)" }),
  indicatorSeparator: (base) => ({ ...base, backgroundColor: "var(--color-tertiary)" }),
  dropdownIndicator: (base) => ({ ...base, color: "var(--text-muted)" }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--color-secondary)",
    border: "1px solid var(--color-tertiary)",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--text-primary)"
      : state.isFocused
      ? "var(--color-tertiary)"
      : "transparent",
    color: state.isSelected ? "var(--color-secondary)" : "var(--text-secondary)",
    cursor: "pointer",
  }),
};

const FormSelect = (props) => {
  return (
    <Select
      isMulti={props.isMulti}
      name={props.name}
      menuPlacement='auto'
      menuPosition='fixed'
      placeholder={props.placeholder}
      options={props.options}
      className={`${classes.Select}`}
      styles={themedStyles}
      onChange={props.onChange} // Pass the callback correctly
      value={props.value} // Pass the selected value(s) correctly
    />
  );
};

export default FormSelect;
