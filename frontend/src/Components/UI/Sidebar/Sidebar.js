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
        <span className={classes["confirm-text"]}>Delete “{item.label}”?</span>
        <div className={classes["confirm-actions"]}>
          <button
            type='button'
            className={classes.danger}
            onClick={() => onDelete(item.id)}
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
        onClick={() => onSelect(item.id)}
        aria-current={active ? "true" : undefined}
      >
        {item.label}
      </button>
      <div className={classes.actions}>
        <button
          type='button'
          className={`${classes.icon} ${item.favorite ? classes.starred : ""}`}
          onClick={() => onToggleFavorite(item.id)}
          aria-pressed={!!item.favorite}
          aria-label={
            item.favorite
              ? `Remove ${item.label} from favourites`
              : `Add ${item.label} to favourites`
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
            aria-label={`Delete ${item.label}`}
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
            key={item.id}
            item={item}
            active={item.id === itemProps.activeId}
            {...itemProps}
          />
        ))}
      </ul>
    </section>
  );

// Repeated titles get a number, counted from the oldest: "Title", "Title (2)", ...
const withLabels = (items) => {
  const seen = new Map();
  const labels = new Map();
  for (const item of [...items].reverse()) {
    const count = (seen.get(item.title) || 0) + 1;
    seen.set(item.title, count);
    labels.set(item.id, count > 1 ? `${item.title} (${count})` : item.title);
  }
  return items.map((item) => ({ ...item, label: labels.get(item.id) }));
};

// items: [{ id, title, favorite }], newest first
const Sidebar = (props) => {
  const items = withLabels(props.items);
  const itemProps = {
    activeId: props.activeId,
    onSelect: props.handleClick,
    onToggleFavorite: props.onToggleFavorite,
    onDelete: props.onDelete,
  };
  const favorites = items.filter((item) => item.favorite);
  const others = items.filter((item) => !item.favorite);

  return (
    <section className={classes["side-bar"]}>
      <div className={classes["sidebar-button"]}>
        <Button onClick={props.createNewEncounter}>{props.button}</Button>
      </div>
      <div className={classes.scroll}>
        <HistoryGroup label='Favourites' items={favorites} {...itemProps} />
        <HistoryGroup label='Recent' items={others} {...itemProps} />
        {items.length === 0 && (
          <p className={classes.empty}>Nothing saved yet.</p>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
