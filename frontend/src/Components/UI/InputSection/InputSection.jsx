import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiceD20 } from "@fortawesome/free-solid-svg-icons";
import ChoiceGroup from "../Choice/ChoiceGroup";
import RangeSlider from "../Choice/RangeSlider";
import { ErrorBanner } from "../Feedback/Feedback";
import { titleCase } from "../../../util/format";
import classes from "../Choice/Choice.module.css";
import {
  locations,
  locationGroups,
  crTiers,
  numbersArray,
} from "../../Arrays/options";

const DEFAULT_CR = 5;
const MIN_CR = numbersArray[0];
const MAX_CR = numbersArray[numbersArray.length - 1];

const InputSection = ({
  value1,
  value2,
  setValue1,
  setValue2,
  getMessages,
  error,
}) => {
  const [query, setQuery] = useState("");

  // The page starts with no challenge rating, so give the slider a sensible default
  useEffect(() => {
    if (!value2) setValue2(String(DEFAULT_CR));
  }, [value2, setValue2]);

  const cr = Number(value2) || DEFAULT_CR;
  const tier = crTiers.find((t) => cr <= t.max)?.label;

  const search = query.trim().toLowerCase();
  const groups = locationGroups
    .map((group) => ({
      ...group,
      locations: group.locations.filter((l) => l.includes(search)),
    }))
    .filter((group) => group.locations.length > 0);

  const pickRandomLocation = () => {
    setQuery("");
    setValue1(locations[Math.floor(Math.random() * locations.length)]);
  };

  return (
    <div className={classes.page}>
      <div className={classes.panel}>
        <h1 className={classes.title}>Create a Random Encounter</h1>

        <section className={classes.field}>
          <h2 className={classes["field-label"]}>Location</h2>
          <div className={classes["input-row"]}>
            <input
              type='search'
              className={classes.input}
              placeholder='Search locations…'
              aria-label='Search locations'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type='button'
              className={classes.secondary}
              onClick={pickRandomLocation}
            >
              <FontAwesomeIcon icon={faDiceD20} className={classes.icon} /> Random
            </button>
          </div>

          {groups.map((group) => (
            <div key={group.label}>
              <h3 className={classes["group-label"]}>{group.label}</h3>
              <ChoiceGroup
                label={group.label}
                options={group.locations.map((l) => ({
                  value: l,
                  label: titleCase(l),
                }))}
                value={value1}
                onChange={setValue1}
              />
            </div>
          ))}
          {groups.length === 0 && (
            <p className={classes.empty}>No locations match “{query}”.</p>
          )}
        </section>

        <section className={classes.field}>
          <h2 className={classes["field-label"]}>Challenge Rating</h2>
          <RangeSlider
            label='Challenge rating'
            min={MIN_CR}
            max={MAX_CR}
            value={cr}
            caption={tier}
            onChange={(value) => setValue2(String(value))}
          />
        </section>

        {error && <ErrorBanner message={error} onRetry={getMessages} />}

        <div className={classes.summary}>
          <span
            className={`${classes["summary-text"]} ${
              value1 ? "" : classes.pending
            }`}
          >
            {value1
              ? `${titleCase(value1)} · CR ${cr}`
              : "Choose a location to roll an encounter"}
          </span>
          <button
            type='button'
            className={classes.primary}
            disabled={!value1}
            onClick={getMessages}
          >
            Roll Encounter
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputSection;
