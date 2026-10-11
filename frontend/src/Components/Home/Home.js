import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faDove,
  faDragon,
  faHatWizard,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../../store/sidebar-context";
import logo from "../../Images/logo.svg";
import classes from "./Home.module.css";

const RECENT_COUNT = 3;

const FEATURES = [
  {
    to: "/encounter",
    icon: faDragon,
    title: "Random Encounter",
    description:
      "Pick a location and a challenge rating. Get monsters with stat blocks, hazards, treasure, twists and artwork.",
    action: "Roll an encounter",
  },
  {
    to: "/creator",
    icon: faHatWizard,
    title: "Character Creator",
    description:
      "Pick a race, class and level. Get ability scores, spells, a personality, a backstory and a portrait.",
    action: "Create a character",
  },
];

const COMING_SOON = [
  { icon: faMap, title: "Maps" },
  { icon: faDove, title: "Non-Combat Encounters" },
];

// "Wraith, 2× Mummy, Flameskull" from the monsters rolled for an encounter
const monsterSummary = (monsters = []) => {
  const counts = new Map();
  for (const { monsterName } of monsters) {
    counts.set(monsterName, (counts.get(monsterName) || 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => (count > 1 ? `${count}× ${name}` : name))
    .join(", ");
};

const latest = (history) => [...history].reverse().slice(0, RECENT_COUNT);

const RecentList = ({ title, icon, to, entries, describe }) => (
  <div className={classes["recent-group"]}>
    <h3 className={classes["recent-heading"]}>{title}</h3>
    {entries.length === 0 ? (
      <p className={classes["recent-empty"]}>Nothing yet.</p>
    ) : (
      <ul className={classes["recent-list"]}>
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              to={to}
              state={{ openId: entry.id }}
              className={classes["recent-item"]}
            >
              <FontAwesomeIcon icon={icon} className={classes["recent-icon"]} />
              <span className={classes["recent-text"]}>
                <span className={classes["recent-title"]}>{entry.title}</span>
                <span className={classes["recent-detail"]}>
                  {describe(entry)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Home = () => {
  const { previousEncounter, previousChats } = useContext(SidebarContext);
  const recentEncounters = latest(previousEncounter);
  const recentCharacters = latest(previousChats);
  const hasRecent = recentEncounters.length > 0 || recentCharacters.length > 0;

  return (
    <div className={classes.home}>
      <header className={classes.hero}>
        <img src={logo} alt='' className={classes.logo} />
        <h1 className={classes.title}>Support Roll</h1>
        <p className={classes.tagline}>
          Encounters and characters for your next session, rolled in seconds.
        </p>
      </header>

      <section className={classes.features} aria-label='Tools'>
        {FEATURES.map((feature) => (
          <Link key={feature.to} to={feature.to} className={classes.feature}>
            <FontAwesomeIcon
              icon={feature.icon}
              className={classes["feature-icon"]}
            />
            <h2 className={classes["feature-title"]}>{feature.title}</h2>
            <p className={classes["feature-description"]}>
              {feature.description}
            </p>
            <span className={classes["feature-action"]}>
              {feature.action}{" "}
              <FontAwesomeIcon
                icon={faArrowRight}
                className={classes["action-icon"]}
              />
            </span>
          </Link>
        ))}
      </section>

      {hasRecent && (
        <section className={classes.section}>
          <h2 className={classes["section-title"]}>Recent</h2>
          <div className={classes.recent}>
            <RecentList
              title='Encounters'
              icon={faDragon}
              to='/encounter'
              entries={recentEncounters}
              describe={(entry) =>
                monsterSummary(entry.monsterList) || "Encounter"
              }
            />
            <RecentList
              title='Characters'
              icon={faHatWizard}
              to='/creator'
              entries={recentCharacters}
              describe={({ first }) =>
                first
                  ? `${first.Race} ${first.Class} · Level ${first.Level}`
                  : "Character"
              }
            />
          </div>
        </section>
      )}

      <section className={classes.section}>
        <h2 className={classes["section-title"]}>Coming Soon</h2>
        <div className={classes.soon}>
          {COMING_SOON.map((item) => (
            <div key={item.title} className={classes["soon-item"]}>
              <FontAwesomeIcon icon={item.icon} className={classes["soon-icon"]} />
              {item.title}
            </div>
          ))}
        </div>
      </section>

      <footer className={classes.footer}>
        Monster stat blocks from the System Reference Document 5.1 via Open5e
        (CC-BY-4.0). Encounter and character text and artwork are
        AI-generated.
      </footer>
    </div>
  );
};

export default Home;
