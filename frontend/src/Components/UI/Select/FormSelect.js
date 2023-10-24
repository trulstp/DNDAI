import React from "react";
import Select from "react-select";
import classes from "./FormSelect.module.css";

const FormSelect = (props) => {
  return (
    <Select
      isMulti={props.isMulti}
      menuPlacement='auto'
      menuPosition='fixed'
      name={props.name}
      placeholder={props.placeholder}
      options={props.options}
      className={classes.Select}
      onChange={props.onChange} // Pass the callback correctly
      value={props.value} // Pass the selected value(s) correctly
    />
  );
};

export default FormSelect;
