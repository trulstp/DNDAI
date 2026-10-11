import React from "react";
import classes from "./Choice.module.css";

// Slider with the current value shown large and a caption explaining it
const RangeSlider = ({ label, min, max, value, onChange, caption }) => (
  <div className={classes.slider}>
    <div className={classes["slider-readout"]}>
      <output className={classes["slider-value"]}>{value}</output>
      <span className={classes["slider-caption"]}>{caption}</span>
    </div>
    <input
      type='range'
      min={min}
      max={max}
      value={value}
      aria-label={label}
      aria-valuetext={`${value}, ${caption}`}
      onChange={(e) => onChange(Number(e.target.value))}
      className={classes.range}
      style={{ "--fill": `${((value - min) / (max - min)) * 100}%` }}
    />
    <div className={classes["slider-scale"]}>
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

export default RangeSlider;
