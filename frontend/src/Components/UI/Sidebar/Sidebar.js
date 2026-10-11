import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import classes from "./Sidebar.module.css";
import Button from "../Buttons/Button";

// One saved item: select it, star it, and (when onDelete is given) delete it after a confirm
const HistoryItem = ({ item, active, onSelect, onToggleFavorite, onDelete }) => {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <li className={`${classes.item} ${classes.confirm}`}>
        <span className={classes["confirm-text"]}>Delete “{item.title}”?</span>
        <div className={classes["confirm-actions"]}>
          <button
            type='button'
            className={classes.danger}
            onClick={() => onDelete(item.title)}
          >
            Delete
          </button>
          <button
            type='button'
            className={classes.cancel}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`${classes.item} ${active ? classes.active : ""}`}>
      <button
        type='button'
        className={classes.title}
        onClick={() => onSelect(item.title)}
        aria-current={active ? "true" : undefined}
      >
        {item.title}
      </button>
      <div className={classes.actions}>
        <button
          type='button'
          className={`${classes.icon} ${item.favorite ? classes.starred : ""}`}
          onClick={() => onToggleFavorite(item.title)}
          aria-pressed={!!item.favorite}
          aria-label={
            item.favorite
              ? `Remove ${item.title} from favourites`
              : `Add ${item.title} to favourites`
          }
          title={item.favorite ? "Remove from favourites" : "Add to favourites"}
        >
          <FontAwesomeIcon icon={faStar} />
        </button>
        {onDelete && (
          <button
            type='button'
            className={classes.icon}
            onClick={() => setConfirming(true)}
            aria-label={`Delete ${item.title}`}
            title='Delete'
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        )}
      </div>
    </li>
  );
};

const HistoryGroup = ({ label, items, ...itemProps }) =>
  items.length > 0 && (
    <section className={classes.group}>
      <h3 className={classes["group-label"]}>{label}</h3>
      <ul className={classes.history}>
        {items.map((item) => (
          <HistoryItem
            key={item.title}
            item={item}
            active={item.title === itemProps.activeTitle}
            {...itemProps}
          />
        ))}
      </ul>
    </section>
  );

// items: [{ title, favorite }], newest first
const Sidebar = (props) => {
  const itemProps = {
    activeTitle: props.activeTitle,
    onSelect: props.handleClick,
    onToggleFavorite: props.onToggleFavorite,
    onDelete: props.onDelete,
  };
  const favorites = props.items.filter((item) => item.favorite);
  const others = props.items.filter((item) => !item.favorite);

  return (
    <section className={classes["side-bar"]}>
      <div className={classes["sidebar-button"]}>
        <Button onClick={props.createNewEncounter}>{props.button}</Button>
      </div>
      <div className={classes.scroll}>
        <HistoryGroup label='Favourites' items={favorites} {...itemProps} />
        <HistoryGroup label='Recent' items={others} {...itemProps} />
        {props.items.length === 0 && (
          <p className={classes.empty}>Nothing saved yet.</p>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
