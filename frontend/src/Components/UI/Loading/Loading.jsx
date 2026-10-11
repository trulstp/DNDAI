import React from "react";
import PropTypes from "prop-types";
import classes from "./Loading.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDragon } from "@fortawesome/free-solid-svg-icons";
import { useServerWaking } from "../../../util/api";

// Generation takes a while, so say what's being made and roughly how long it takes
const Loading = ({ title, details, hint }) => {
  const serverWaking = useServerWaking();
  return (
    <div className={classes.loading} role='status' aria-live='polite'>
      <FontAwesomeIcon icon={faDragon} bounce className={classes.icon} />
      <h1 className={classes.title}>{title}</h1>
      {details.filter(Boolean).map((detail) => (
        <p key={detail} className={classes.detail}>
          {detail}
        </p>
      ))}
      {hint && <p className={classes.hint}>{hint}</p>}
      {serverWaking && (
        <p className={classes.hint}>
          The server was asleep after a quiet spell and is starting up, so this first one can take
          up to a minute longer.
        </p>
      )}
    </div>
  );
};

Loading.propTypes = {
  title: PropTypes.string,
  details: PropTypes.arrayOf(PropTypes.string),
  hint: PropTypes.string,
};

Loading.defaultProps = {
  title: "Loading…",
  details: [],
  hint: "This usually takes 10–20 seconds.",
};

export default Loading;
