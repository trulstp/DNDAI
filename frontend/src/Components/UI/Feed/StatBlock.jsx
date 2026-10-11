import React from "react";
import classes from "./StatBlock.module.css";

const ABILITIES = [
  ["STR", "strength"],
  ["DEX", "dexterity"],
  ["CON", "constitution"],
  ["INT", "intelligence"],
  ["WIS", "wisdom"],
  ["CHA", "charisma"],
];

const signed = (n) => (n >= 0 ? `+${n}` : `${n}`);
export const modifier = (score) => signed(Math.floor((score - 10) / 2));
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const formatSpeed = (speed = {}) =>
  Object.entries(speed)
    .filter(([mode, value]) => mode !== "hover" && value)
    .map(([mode, value]) =>
      mode === "walk"
        ? `${value} ft.`
        : `${mode} ${value} ft.${mode === "fly" && speed.hover ? " (hover)" : ""}`
    )
    .join(", ");

const formatSaves = (statblock) =>
  ABILITIES.filter(([, ability]) => statblock[`${ability}_save`] != null)
    .map(([abbr, ability]) => `${capitalize(abbr.toLowerCase())} ${signed(statblock[`${ability}_save`])}`)
    .join(", ");

const formatSkills = (skills = {}) =>
  Object.entries(skills)
    .map(([skill, bonus]) => `${capitalize(skill)} ${signed(bonus)}`)
    .join(", ");

const Property = ({ label, value }) =>
  value ? (
    <p className={classes.property}>
      <strong>{label}</strong> {value}
    </p>
  ) : null;

const NamedTextList = ({ title, entries, intro }) =>
  entries?.length ? (
    <>
      {title && <h4 className={classes.subheading}>{title}</h4>}
      {intro && <p className={classes.entry}>{intro}</p>}
      {entries.map((entry) => (
        <p key={entry.name} className={classes.entry}>
          <strong>
            <em>{entry.name}.</em>
          </strong>{" "}
          {entry.desc}
        </p>
      ))}
    </>
  ) : null;

const StatBlock = ({ statblock }) => {
  const typeLine = [
    statblock.size,
    statblock.type?.toLowerCase() +
      (statblock.subtype ? ` (${statblock.subtype})` : ""),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes.statblock}>
      <h3 className={classes.name}>{statblock.name}</h3>
      <p className={classes.type}>
        {typeLine}
        {statblock.alignment && `, ${statblock.alignment}`}
      </p>

      <hr className={classes.rule} />
      <Property
        label='Armor Class'
        value={`${statblock.armor_class}${
          statblock.armor_desc ? ` (${statblock.armor_desc})` : ""
        }`}
      />
      <Property
        label='Hit Points'
        value={`${statblock.hit_points}${
          statblock.hit_dice ? ` (${statblock.hit_dice})` : ""
        }`}
      />
      <Property label='Speed' value={formatSpeed(statblock.speed)} />

      <hr className={classes.rule} />
      <div className={classes.abilities}>
        {ABILITIES.map(([abbr, ability]) => (
          <div key={abbr} className={classes.ability}>
            <strong>{abbr}</strong>
            <span>
              {statblock[ability]} ({modifier(statblock[ability])})
            </span>
          </div>
        ))}
      </div>

      <hr className={classes.rule} />
      <Property label='Saving Throws' value={formatSaves(statblock)} />
      <Property label='Skills' value={formatSkills(statblock.skills)} />
      <Property
        label='Damage Vulnerabilities'
        value={statblock.damage_vulnerabilities}
      />
      <Property
        label='Damage Resistances'
        value={statblock.damage_resistances}
      />
      <Property label='Damage Immunities' value={statblock.damage_immunities} />
      <Property
        label='Condition Immunities'
        value={statblock.condition_immunities}
      />
      <Property label='Senses' value={statblock.senses} />
      <Property label='Languages' value={statblock.languages} />
      <Property label='Challenge' value={statblock.challenge_rating} />

      <NamedTextList entries={statblock.special_abilities} />
      <NamedTextList title='Actions' entries={statblock.actions} />
      <NamedTextList title='Bonus Actions' entries={statblock.bonus_actions} />
      <NamedTextList title='Reactions' entries={statblock.reactions} />
      <NamedTextList
        title='Legendary Actions'
        intro={statblock.legendary_desc}
        entries={statblock.legendary_actions}
      />
    </div>
  );
};

export default StatBlock;
