// CharacterSheet.js
import Button from "../Buttons/Button";
import React from "react";
import styles from "./CharacterSheet.module.css"; // Ensure this path matches your CSS module file

const CharacterSheet = ({ characterData, imageGenerator, images }) => {
  if (!characterData || !characterData.first || !characterData.second) {
    return <div>Loading character data...</div>;
  }
  const { first, second } = characterData;
  const hasSpells =
    first.Spells &&
    Object.values(first.Spells).some((spells) => spells.length > 0);

  return (
    <div className={styles.container}>
      <div className={styles["first-column"]}>
        <h1 className={styles.name}>{first.Name}</h1>
        <h1 className={styles.charinfo}>
          {first.Class} {first.Race} Level {first.Level}
        </h1>
        <h2 className={styles.charinfo}>Alignment: {first.Alignment}</h2>

        <div className={styles["image-section"]}>
          <h2 className={styles.section}>Character Image</h2>
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt='Character'
                className={styles.characterImage}
              />
            ))
          ) : (
            <div className={styles["image-button"]}>
              <Button onClick={imageGenerator}>Generate Image?</Button>
            </div>
          )}
        </div>

        <h2 className={styles.section}>Stats</h2>
        <p className={styles.paragraph}>
          Hit Points:{" "}
          <span className={styles.apiparagraph}>{first.Hitpoints}</span>
        </p>

        <p className={styles.paragraph}>
          Size: <span className={styles.apiparagraph}>{first.Size}</span>{" "}
        </p>

        <p className={styles.paragraph}>
          Speed: <span className={styles.apiparagraph}>{first.Speed}</span>{" "}
        </p>

        {/* Stats Section */}
        <h2 className={styles.section}>Stats</h2>
        {/* Dynamically display each stat */}
        <div className={styles["stat-container"]}>
          <p>STR</p>
          <p>DEX</p>
          <p>CON</p>
          <p>INT</p>
          <p>WIS</p>
          <p>CHA</p>
        </div>
        <div className={styles["stat-container2"]}>
          <p>{first.Stats.Strength}</p>
          <p>{first.Stats.Dexterity}</p>
          <p>{first.Stats.Constitution}</p>
          <p>{first.Stats.Intelligence}</p>
          <p>{first.Stats.Wisdom}</p>
          <p>{first.Stats.Charisma}</p>
        </div>

        <h2 className={styles.section}>Class Skills</h2>
        {Object.entries(first.ClassSkills)
          .filter(([level, classskills]) => classskills.length > 0) // Filter out empty arrays
          .map(([level, classskills]) => (
            <div key={level}>
              <p className={styles["paragraph"]}>Level {level}</p>
              <p className={styles.paragraph}>{classskills.join(", ")}</p>
            </div>
          ))}

        <h2 className={styles.section}>Abilities</h2>
        <p className={styles.paragraph}>{first.Abilities.join(", ")}</p>

        <h2 className={styles.section}>Skills</h2>
        <p className={styles.paragraph}>{first.Skills.join(", ")}</p>

        <h2 className={styles.section}>Languages</h2>
        <p className={styles.paragraph}>{first.Languages.join(", ")}</p>
      </div>

      <div className={styles["second-column"]}>
        {/* Displaying the personality traits, bonds, ideals, etc. */}
        <div className={styles["gpt-container"]}>
          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Personality</h2>
            <p>{second.personality}</p>
          </div>

          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Bonds</h2>
            <p>{second.bonds}</p>
          </div>

          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Ideals</h2>
            <p>{second.ideals}</p>
          </div>

          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Flaws</h2>
            <p>{second.flaws}</p>
          </div>

          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Roleplay</h2>
            <p>{second.roleplay}</p>
          </div>

          <div className={styles["section-container"]}>
            <h2 className={styles["gpt-section"]}>Gear</h2>
            <p>{first.Equipment.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className={styles["backstory"]}>
        <h2 className={styles["backstory-header"]}>Backstory</h2>
        <p>{second.backstory}</p>
      </div>

      {/* Display spells if available */}
      {hasSpells && (
        <div className={styles["spell-section"]}>
          <h1 className={styles.spells}>Spells</h1>
          {Object.entries(first.Spells).map(
            ([level, spells]) =>
              spells.length > 0 && (
                <div key={level}>
                  <p className={styles["spell-level"]}>Level {level}</p>
                  <p>{spells.join(", ")}</p>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;
