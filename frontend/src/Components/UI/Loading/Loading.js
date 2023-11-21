import React, { useContext } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { SidebarContext } from "../../../store/sidebar-context";
import classes from "./Loading.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDragon } from "@fortawesome/free-solid-svg-icons";

const Loading = (props) => {
  const { sidebarOpen } = useContext(SidebarContext);
  const history = !sidebarOpen ? "history" : "";

  return (
    <div className={`${classes.loading} ${classes[history]}`}>
      <FontAwesomeIcon
        icon={faDragon}
        bounce
        size='xl'
        style={{ color: "#ff0000" }}
      />
      <h2 className={classes["loading-text"]}>{props.text || "Loading..."}</h2>
    </div>
  );
};

// Define prop types
Loading.propTypes = {
  text: PropTypes.string,
};

// Default props
Loading.defaultProps = {
  text: "Loading...",
};

export default Loading;
