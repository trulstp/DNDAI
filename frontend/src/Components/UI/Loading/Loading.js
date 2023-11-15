import React, { useContext } from "react";
import { SidebarContext } from "../../../store/sidebar-context";
import classes from "./Loading.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDragon } from "@fortawesome/free-solid-svg-icons";

const formatMonsterList = (monsters) => {
  const monsterCount = {};

  // Count the occurrences of each monster
  monsters.forEach((monster) => {
    if (monsterCount[monster]) {
      monsterCount[monster]++;
    } else {
      monsterCount[monster] = 1;
    }
  });

  // Create a formatted string
  const formattedMonsters = Object.entries(monsterCount).map(
    ([monster, count]) => {
      return `${count} ${monster}${count > 1 ? "s" : ""}`;
    }
  );

  return formattedMonsters.join(", ");
};

const Loading = (props) => {
  const { sidebarOpen } = useContext(SidebarContext);
  const history = !sidebarOpen ? "history" : "";
  const formattedEncounter = formatMonsterList(props.encounter);

  return (
    <div className={`${classes.loading} ${classes[history]}`}>
      <FontAwesomeIcon
        icon={faDragon}
        bounce
        size='xl'
        style={{ color: "#ff0000" }}
      />
      {formattedEncounter.length > 0 && (
        <h2 className={classes["loading-text"]}>
          An encounter of {formattedEncounter} is being generated
        </h2>
      )}
      {!formattedEncounter.length > 0 && (
        <h2 className={classes["loading-text"]}>
          An encounter{formattedEncounter} is being generated
        </h2>
      )}
    </div>
  );
};

export default Loading;
