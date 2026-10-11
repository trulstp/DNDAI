import React from "react";
import classes from "./Collapsible.module.css";

// A real heading (so screen readers can jump between sections) containing a button
// (so the section can be collapsed with the keyboard too)
const ToggleHeading = ({ title, isOpen, onToggle, className, level }) => {
  const Heading = `h${level}`;
  return (
    <Heading className={classes["heading-wrap"]}>
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
    </Heading>
  );
};

// A card whose heading collapses its content
export const CollapsibleCard = ({
  title,
  isOpen,
  onToggle,
  className,
  level = 2,
  children,
}) => (
  <section className={`${classes.card} ${className || ""}`}>
    <ToggleHeading
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      className={classes.heading}
      level={level}
    />
    {isOpen && children}
  </section>
);

// A smaller collapsible heading for use inside a card or stat block
export const CollapsibleSubsection = ({
  title,
  isOpen,
  onToggle,
  level = 3,
  children,
}) => (
  <>
    <ToggleHeading
      title={title}
      isOpen={isOpen}
      onToggle={onToggle}
      className={classes.subheading}
      level={level}
    />
    {isOpen && children}
  </>
);

export const CardText = ({ children }) => (
  <p className={classes.text}>{children}</p>
);
