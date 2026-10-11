import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Buttons/Button";
import classes from "./Feedback.module.css";

// A failed request, with a way to try again
export const ErrorBanner = ({ message, onRetry }) => (
  <div className={classes.banner} role='alert'>
    <FontAwesomeIcon
      icon={faTriangleExclamation}
      className={classes["banner-icon"]}
    />
    <span className={classes["banner-text"]}>{message}</span>
    {onRetry && (
      <button type='button' className={classes.retry} onClick={onRetry}>
        <FontAwesomeIcon icon={faRotateRight} className={classes["retry-icon"]} />
        Try again
      </button>
    )}
  </div>
);

// Image generation takes 10-20 seconds, so show progress and any error
export const GenerateImageButton = ({ status = { state: "idle" }, onGenerate }) => (
  <div className={classes.generate}>
    {status.state === "loading" ? (
      <Button disabled>
        <span className={classes.spinner} aria-hidden='true' /> Generating
        artwork…
      </Button>
    ) : (
      <Button onClick={() => onGenerate()}>
        {status.state === "error" ? "Try again" : "Generate Image?"}
      </Button>
    )}
    {status.state === "error" && (
      <p className={classes["generate-error"]} role='alert'>
        {status.message}
      </p>
    )}
  </div>
);
