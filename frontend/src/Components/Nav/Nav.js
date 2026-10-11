import React from "react";
import classes from "./Nav.module.css";
import { Link, useLocation } from "react-router-dom";
import { SidebarContext } from "../../store/sidebar-context";
import { useContext } from "react";
import logo from "../../Images/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDragon,
  faHatWizard,
  faMoon,
  faScroll,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const {
    handleSidebar,
    handleLightMode,
    lightMode,
    sidebarOpen,
    handleHover,
    handleHoverOff,
  } = useContext(SidebarContext);

  const location = useLocation();

  const historyTitle = location.pathname.startsWith("/creator")
    ? "Character"
    : "Encounter";

  const history = sidebarOpen ? "history" : "";
  const historyNav = sidebarOpen ? "historyNav" : "navbar";

  return (
    <nav
      className={`${classes[historyNav]}`}
      onMouseEnter={() => handleHover()}
      onMouseLeave={() => handleHoverOff()}
    >
      <ul className={classes["navbar-nav"]}>
        <li className={classes["logo"]}>
          <Link
            to='/'
            className={classes["nav-link-logo"]}
            aria-label='Support Roll home'
          >
            {!sidebarOpen ? (
              <span
                className={`${classes["link-text"]} ${classes["logo-text"]} ${classes["link-text-logo"]}`}
              >
                <span className={classes["fa-secondary"]}>Support</span>
                <br />
                <span className={classes["fa-primary"]}>Roll</span>
              </span>
            ) : (
              <span
                className={`${classes["link-text"]} ${classes["logo-text"]} ${classes["link-text-logo"]}`}
              >
                <span className={classes["fa-secondary"]}>{historyTitle}</span>
                <br />
                <span className={classes["fa-primary"]}>History</span>
              </span>
            )}

            <img src={logo} alt='' className={classes["logo-mark"]} />
          </Link>
        </li>
        <li className={classes["nav-item"]}>
          <button
            type='button'
            onClick={handleSidebar}
            className={`${classes["nav-link"]} ${classes["nav-button"]} ${classes[history]}`}
            aria-expanded={sidebarOpen}
          >
            <FontAwesomeIcon icon={faScroll} className={classes["icon-wide"]} />
            <span className={classes["link-text"]}>History</span>
          </button>
        </li>
        <li className={classes["nav-item"]}>
          <Link to='/encounter' className={classes["nav-link"]}>
            <FontAwesomeIcon icon={faDragon} />
            <span className={classes["link-text"]}>Random Encounter</span>
          </Link>
        </li>
        <li className={classes["nav-item"]}>
          <Link to='/creator' className={classes["nav-link"]}>
            <FontAwesomeIcon icon={faHatWizard} />
            <span className={classes["link-text"]}>Character Creator</span>
          </Link>
        </li>
        {/* Hidden until login works:
        <li className={classes["nav-item"]}>
          <Link to='/login' className={classes["nav-link"]}>
            <FontAwesomeIcon icon={faRightToBracket} />
            <span className={classes["link-text"]}>Login</span>
          </Link>
        </li> */}
        <li className={classes["nav-item"]}>
          <button
            type='button'
            onClick={handleLightMode}
            className={`${classes["nav-link"]} ${classes["nav-button"]}`}
          >
            <FontAwesomeIcon icon={lightMode ? faMoon : faSun} />
            <span className={classes["link-text"]}>
              {lightMode ? "Dark Mode" : "Light Mode"}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
