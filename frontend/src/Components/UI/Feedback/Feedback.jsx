import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faTriangleExclamation,
  faWandMagicSparkles,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import choice from "../Choice/Choice.module.css";
import classes from "./Feedback.module.css";
import { SidebarContext } from "../../../store/sidebar-context";

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
        <FontAwesomeIcon
          icon={faRotateRight}
          className={classes["retry-icon"]}
        />
        Try again
      </button>
    )}
  </div>
);

// Says what was removed when browser storage filled up. The live region is always there
// so screen readers announce the message when it appears
export const StorageNotice = () => {
  const { storageNotice, dismissStorageNotice } = useContext(SidebarContext);
  return (
    <div className={classes["notice-region"]} role='status'>
      {storageNotice && (
        <div className={`${classes.banner} ${classes.notice}`}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className={classes["banner-icon"]}
          />
          <span className={classes["banner-text"]}>{storageNotice}</span>
          <button
            type='button'
            className={classes.retry}
            onClick={dismissStorageNotice}
          >
            <FontAwesomeIcon icon={faXmark} className={classes["retry-icon"]} />
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

const IMAGE_KINDS = {
  artwork: {
    empty: "No artwork for this encounter yet.",
    action: "Generate artwork",
  },
  portrait: {
    empty: "No portrait for this character yet.",
    action: "Generate portrait",
  },
};

// Where an encounter's artwork or a character's portrait will go. Generating one takes a
// while and costs an API call, so say so, and show progress and any error in place
export const ImagePlaceholder = ({
  kind,
  status = { state: "idle" },
  onGenerate,
}) => {
  const text = IMAGE_KINDS[kind];
  const loading = status.state === "loading";
  return (
    <div className={classes.placeholder}>
      {/* Announces the start of generation; the button text alone isn't read out */}
      <span className='visually-hidden' role='status'>
        {loading ? `${text.action.replace("Generate", "Generating")}…` : ""}
      </span>
      <p className={classes["placeholder-text"]}>{text.empty}</p>
      <button
        type='button'
        className={choice.primary}
        onClick={() => onGenerate()}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className={classes.spinner} aria-hidden='true' />
            Generating…
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faWandMagicSparkles}
              className={choice.icon}
            />{" "}
            {status.state === "error" ? "Try again" : text.action}
          </>
        )}
      </button>
      {status.state === "error" ? (
        <p className={classes["generate-error"]} role='alert'>
          {status.message}
        </p>
      ) : (
        <p className={classes["placeholder-hint"]}>Takes about 15 seconds</p>
      )}
    </div>
  );
};
