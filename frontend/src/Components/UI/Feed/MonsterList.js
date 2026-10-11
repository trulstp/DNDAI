import React, { useEffect, useMemo, useState } from "react";
import StatBlock from "./StatBlock";
import { CollapsibleSubsection } from "../Collapsible/Collapsible";
import classes from "./MonsterList.module.css";
const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const FRACTIONAL_CR = { 0.125: "1/8", 0.25: "1/4", 0.5: "1/2" };
const formatCR = (cr) => FRACTIONAL_CR[cr] || String(cr);

// Groups the encounter into one row per monster with a count, keeping the lead monster first
const groupMonsters = (monsters) => {
  const groups = new Map();
  for (const monster of monsters) {
    const group = groups.get(monster.monsterName);
    if (group) group.count++;
    else groups.set(monster.monsterName, { ...monster, count: 1 });
  }
  return [...groups.values()];
};

const MonsterList = ({ monsters, isVisible, toggleVisibility }) => {
  const groups = useMemo(() => groupMonsters(monsters), [monsters]);
  const namesKey = groups.map((group) => group.monsterName).join(",");

  const [statblocks, setStatblocks] = useState(null);
  const [status, setStatus] = useState("idle");
  const [expanded, setExpanded] = useState(() => new Set());

  // Stat blocks are fetched the first time the section is open, not stored in history.
  // Feed remounts this component per encounter (via key), so a response can't land on the wrong one.
  useEffect(() => {
    if (!isVisible || status !== "idle") return;

    setStatus("loading");
    fetch(`${API}/app/statblocks?names=${encodeURIComponent(namesKey)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setStatblocks(data);
        setStatus("loaded");
      })
      .catch((error) => {
        console.error("Error fetching stat blocks:", error);
        setStatus("error");
      });
  }, [isVisible, status, namesKey]);

  const toggleRow = (name) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div>
      <CollapsibleSubsection
        title='Stat Blocks'
        isOpen={isVisible}
        onToggle={toggleVisibility}
      >
        <>
          {status === "loading" && <p>Loading stat blocks...</p>}
          {status === "error" && (
            <p>
              Stat blocks are unavailable right now.{" "}
              <button
                className={classes.retry}
                onClick={() => setStatus("idle")}
              >
                Try again
              </button>
            </p>
          )}

          <div>
            {groups.map((group) => {
              const statblock = statblocks?.[group.monsterName];
              const isOpen = expanded.has(group.monsterName);
              const summary = [
                group.challengeRating !== undefined &&
                  `CR ${formatCR(group.challengeRating)}`,
                statblock?.type || group.groupTag,
                statblock && `AC ${statblock.armor_class}`,
                statblock && `HP ${statblock.hit_points}`,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <div key={group.monsterName} className={classes.row}>
                  <button
                    className={classes["row-header"]}
                    onClick={() => toggleRow(group.monsterName)}
                    disabled={!statblock}
                    aria-expanded={isOpen}
                  >
                    <span className={classes.caret}>
                      {statblock ? (isOpen ? "▼" : "▶") : "•"}
                    </span>
                    <span className={classes["monster-name"]}>
                      {group.count}× {group.monsterName}
                    </span>
                    <span className={classes.summary}>{summary}</span>
                  </button>
                  {status === "loaded" && !statblock && (
                    <div className={classes.missing}>
                      No SRD stat block. See the Monster Manual.
                    </div>
                  )}
                  {isOpen && statblock && <StatBlock statblock={statblock} />}
                </div>
              );
            })}
          </div>

          <div className={classes.attribution}>
            Stat blocks from the System Reference Document 5.1 via Open5e,
            licensed under CC-BY-4.0.
          </div>
        </>
      </CollapsibleSubsection>
    </div>
  );
};

export default MonsterList;
