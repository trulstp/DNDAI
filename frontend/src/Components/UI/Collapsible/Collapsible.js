import React from "react";
import classes from "./Collapsible.module.css";

// Headings are buttons so sections can be collapsed with the keyboard too
const ToggleHeading = ({ title, isOpen, onToggle, className }) => (
  <button
    type='button'
    className={className}
    onClick={onToggle}
    aria-expanded={isOpen}
  >
    <span>{title}</span>
    <span className={classes.caret} aria-hidden='true'>
      {isOpen ? "−" : "+"}
    </span>
  </button>
);

// A card whose heading collapses its content
export const CollapsibleCard = ({
  title,
  isOpen,
  onToggle,
  className,
  children,
}) => (
  <section className={`${classes.card} ${className || ""}`}>
    <ToggleHeading
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      className={classes.heading}
    />
    {isOpen && children}
  </section>
);

// A smaller collapsible heading for use inside a card or stat block
export const CollapsibleSubsection = ({ title, isOpen, onToggle, children }) => (
  <>
    <ToggleHeading
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      className={classes.subheading}
    />
    {isOpen && children}
  </>
);

export const CardText = ({ children }) => (
  <p className={classes.text}>{children}</p>
);
