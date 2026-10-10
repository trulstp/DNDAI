import Button from "../Buttons/Button";
import React from "react";
import { modifier } from "./StatBlock";
import card from "./StatBlock.module.css";
import styles from "./CharacterSheet.module.css";

const ABILITIES = [
  ["STR", "Strength"],
  ["DEX", "Dexterity"],
  ["CON", "Constitution"],
  ["INT", "Intelligence"],
  ["WIS", "Wisdom"],
  ["CHA", "Charisma"],
];

const PERSONALITY = [
  ["Personality", "personality"],
  ["Ideals", "ideals"],
  ["Bonds", "bonds"],
  ["Flaws", "flaws"],
  ["Quirks and Habits", "quirks_and_habits"],
  ["Trinkets", "trinkets"],
];

const ordinal = (n) =>
  `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n] || "th"}`;
const spellLevelLabel = (level) =>
  Number(level) === 0 ? "Cantrips" : `${ordinal(Number(level))} Level`;

// The generator gives a class feature list per level, or a single string for some levels
const asList = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

// Dragonborn ancestry arrives as a [colour, damage type] pair
const formatTrait = (trait) =>
  Array.isArray(trait)
    ? `Draconic Ancestry: ${trait[0]} (${trait[1].toLowerCase()})`
    : trait;

const Property = ({ label, items }) =>
  items?.length ? (
    <p className={card.property}>
      <strong>{label}</strong> {items.join(", ")}
    </p>
  ) : null;

const CharacterSheet = ({ characterData, imageGenerator, images }) => {
  if (!characterData || !characterData.first || !characterData.second) {
    return <div>Loading character data...</div>;
  }
  const { first, second } = characterData;

  const classFeatures = Object.entries(first.ClassSkills || {})
    .map(([level, features]) => [level, asList(features)])
    .filter(([, features]) => features.length > 0);
  const spells = Object.entries(first.Spells || {}).filter(
    ([, levelSpells]) => levelSpells?.length > 0
  );

  return (
    <div className={styles.sheet}>
      <div className={styles.column}>
        <div className={styles.portrait}>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${first.Name} the ${first.Race} ${first.Class}`}
                className={styles.image}
              />
            ))
          ) : (
            <Button onClick={imageGenerator}>Generate Image?</Button>
          )}
        </div>

        <div className={`${card.statblock} ${styles.character}`}>
          <h1 className={`${card.name} ${styles.name}`}>{first.Name}</h1>
          <p className={card.type}>
            {first.Size} {first.Race.toLowerCase()} {first.Class.toLowerCase()}
            , level {first.Level}, {first.Alignment.toLowerCase()}
          </p>

          <hr className={card.rule} />
          <p className={card.property}>
            <strong>Hit Points</strong> {first.Hitpoints}
          </p>
          <p className={card.property}>
            <strong>Speed</strong> {first.Speed}
          </p>

          <hr className={card.rule} />
          <div className={card.abilities}>
            {ABILITIES.map(([abbr, ability]) => (
              <div key={abbr} className={card.ability}>
                <strong>{abbr}</strong>
                <span>
                  {first.Stats[ability]} ({modifier(first.Stats[ability])})
                </span>
              </div>
            ))}
          </div>

          <hr className={card.rule} />
          <Property label='Skills' items={first.Skills} />
          <Property label='Languages' items={first.Languages} />
          <Property label='Gear' items={first.Equipment} />
          <Property
            label='Traits & Proficiencies'
            items={first.Abilities?.map(formatTrait)}
          />

        </div>
      </div>

      <div className={styles.column}>
        <div className={styles.traits}>
          {PERSONALITY.map(([label, field]) =>
            second[field] ? (
              <div key={field} className={styles.card}>
                <h2 className={styles.heading}>{label}</h2>
                <p>{second[field]}</p>
              </div>
            ) : null
          )}
        </div>

        {second.backstory && (
          <div className={`${styles.card} ${styles.backstory}`}>
            <h2 className={styles.heading}>Backstory</h2>
            <p>{second.backstory}</p>
          </div>
        )}

        {(classFeatures.length > 0 || spells.length > 0) && (
          <div className={`${card.statblock} ${styles.features}`}>
            {classFeatures.length > 0 && (
              <>
                <h4 className={card.subheading}>Class Features</h4>
                {classFeatures.map(([level, features]) => (
                  <p key={level} className={card.entry}>
                    <strong>
                      <em>Level {level}.</em>
                    </strong>{" "}
                    {features.join(", ")}
                  </p>
                ))}
              </>
            )}

            {spells.length > 0 && (
              <>
                <h4 className={card.subheading}>Spells</h4>
                {spells.map(([level, levelSpells]) => (
                  <p key={level} className={card.entry}>
                    <strong>
                      <em>{spellLevelLabel(level)}.</em>
                    </strong>{" "}
                    {levelSpells.join(", ")}
                  </p>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSheet;
