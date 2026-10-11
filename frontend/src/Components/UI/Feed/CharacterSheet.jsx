import { ImagePlaceholder } from "../Feedback/Feedback";
import React, { useEffect, useRef, useState } from "react";
import ResultActions from "../Choice/ResultActions";
import {
  CardText,
  CollapsibleCard,
  CollapsibleSubsection,
} from "../Collapsible/Collapsible";
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

const ordinal = (n) => `${n}${{ 1: "st", 2: "nd", 3: "rd" }[n] || "th"}`;
const spellLevelLabel = (level) =>
  Number(level) === 0 ? "Cantrips" : `${ordinal(Number(level))} Level`;

// The generator gives a class feature list per level, or a single string for some levels
const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);

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

const CharacterSheet = ({
  characterData,
  imageGenerator,
  imageStatus,
  images,
  onNew,
  onReroll,
  rerollHint,
}) => {
  // Collapsed sections stay collapsed when switching between characters
  const [collapsed, setCollapsed] = useState(() => new Set());
  const isOpen = (section) => !collapsed.has(section);
  const toggle = (section) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });

  // A different character starts at the top, not at the previous one's scroll position
  // ...and focus moves to the character's name, so screen readers announce it
  const sheetRef = useRef(null);
  const nameRef = useRef(null);
  const characterId = characterData?.id;
  useEffect(() => {
    sheetRef.current?.scrollIntoView({ block: "start" });
    nameRef.current?.focus({ preventScroll: true });
  }, [characterId]);

  if (!characterData || !characterData.first || !characterData.second) {
    return <div>Loading character data...</div>;
  }
  const { first, second } = characterData;

  const classFeatures = Object.entries(first.ClassSkills || {})
    .map(([level, features]) => [level, asList(features)])
    .filter(([, features]) => features.length > 0);
  const spells = Object.entries(first.Spells || {}).filter(
    ([, levelSpells]) => levelSpells?.length > 0,
  );

  return (
    <div className={styles.page} ref={sheetRef}>
      <div className={styles.actions}>
        <ResultActions
          newLabel='New character'
          onNew={onNew}
          onReroll={onReroll}
          rerollHint={rerollHint}
        />
      </div>
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
              <ImagePlaceholder
                kind='portrait'
                status={imageStatus}
                onGenerate={imageGenerator}
              />
            )}
          </div>

          <div className={`${card.statblock} ${styles.character}`}>
            <h1
              className={`${card.name} ${styles.name}`}
              ref={nameRef}
              tabIndex={-1}
            >
              {first.Name}
            </h1>
            <p className={card.type}>
              {first.Size} {first.Race.toLowerCase()}{" "}
              {first.Class.toLowerCase()}, level {first.Level},{" "}
              {first.Alignment.toLowerCase()}
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
                <CollapsibleCard
                  key={field}
                  title={label}
                  isOpen={isOpen(field)}
                  onToggle={() => toggle(field)}
                >
                  <CardText>{second[field]}</CardText>
                </CollapsibleCard>
              ) : null,
            )}
          </div>

          {second.backstory && (
            <CollapsibleCard
              title='Backstory'
              isOpen={isOpen("backstory")}
              onToggle={() => toggle("backstory")}
              className={styles.backstory}
            >
              <CardText>{second.backstory}</CardText>
            </CollapsibleCard>
          )}

          {(classFeatures.length > 0 || spells.length > 0) && (
            <div className={`${card.statblock} ${styles.features}`}>
              {classFeatures.length > 0 && (
                <CollapsibleSubsection
                  title='Class Features'
                  level={2}
                  isOpen={isOpen("features")}
                  onToggle={() => toggle("features")}
                >
                  {classFeatures.map(([level, features]) => (
                    <p key={level} className={card.entry}>
                      <strong>
                        <em>Level {level}.</em>
                      </strong>{" "}
                      {features.join(", ")}
                    </p>
                  ))}
                </CollapsibleSubsection>
              )}

              {spells.length > 0 && (
                <CollapsibleSubsection
                  title='Spells'
                  level={2}
                  isOpen={isOpen("spells")}
                  onToggle={() => toggle("spells")}
                >
                  {spells.map(([level, levelSpells]) => (
                    <p key={level} className={card.entry}>
                      <strong>
                        <em>{spellLevelLabel(level)}.</em>
                      </strong>{" "}
                      {levelSpells.join(", ")}
                    </p>
                  ))}
                </CollapsibleSubsection>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
