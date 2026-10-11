import React from "react";
import classes from "./Nav.module.css";
import { Link, NavLink, useLocation } from "react-router-dom";
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

// The current page's icon is shown in colour; NavLink also sets aria-current
const navLinkClass = ({ isActive }) =>
  `${classes["nav-link"]} ${isActive ? classes.active : ""}`;

const Nav = () => {
  const {
    handleSidebar,
    handleLightMode,
    lightMode,
    sidebarOpen,
    historyAvailable,
    setNavHovered,
    setNavFocused,
  } = useContext(SidebarContext);

  const location = useLocation();

  const historyTitle = location.pathname.startsWith("/creator")
    ? "Character"
    : "Encounter";

  return (
    <nav
      className={`${classes.navbar} ${sidebarOpen ? classes["sidebar-open"] : ""}`}
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
      // Keyboard focus only: a mouse click also focuses the link, but shouldn't keep the nav open
      onFocus={(event) => setNavFocused(event.target.matches(":focus-visible"))}
      onBlur={(event) => {
        // Only when focus leaves the nav, not when it moves between its items
        if (!event.currentTarget.contains(event.relatedTarget))
          setNavFocused(false);
      }}
    >
      <ul className={classes["navbar-nav"]}>
        <li className={classes["logo"]}>
          <Link
            to='/'
            className={classes["nav-link-logo"]}
            aria-label='Support Roll home'
          >
            <span className={`${classes["link-text"]} ${classes["logo-text"]}`}>
              <span className={classes["fa-secondary"]}>Support</span>
              <br />
              <span className={classes["fa-primary"]}>Roll</span>
            </span>

            <img src={logo} alt='' className={classes["logo-mark"]} />
          </Link>
        </li>
        {/* Only the encounter and character pages have a history sidebar */}
        {historyAvailable && (
          <li className={classes["nav-item"]}>
            <button
              type='button'
              onClick={handleSidebar}
              className={`${classes["nav-link"]} ${classes["nav-button"]} ${
                sidebarOpen ? classes.history : ""
              }`}
              aria-expanded={sidebarOpen}
              aria-label={`${historyTitle} history`}
            >
              <FontAwesomeIcon
                icon={faScroll}
                className={classes["icon-wide"]}
              />
              <span className={classes["link-text"]}>History</span>
            </button>
          </li>
        )}
        <li className={classes["nav-item"]}>
          <NavLink
            to='/encounter'
            className={navLinkClass}
            aria-label='Random Encounter'
          >
            <FontAwesomeIcon icon={faDragon} />
            <span className={classes["link-text"]}>Random Encounter</span>
          </NavLink>
        </li>
        <li className={classes["nav-item"]}>
          <NavLink
            to='/creator'
            className={navLinkClass}
            aria-label='Character Creator'
          >
            <FontAwesomeIcon icon={faHatWizard} />
            <span className={classes["link-text"]}>Character Creator</span>
          </NavLink>
        </li>
        {/* Hidden until login works:
        <li className={classes["nav-item"]}>
          <NavLink to='/login' className={navLinkClass} aria-label='Login'>
            <FontAwesomeIcon icon={faRightToBracket} />
            <span className={classes["link-text"]}>Login</span>
          </NavLink>
        </li> */}
        <li className={`${classes["nav-item"]} ${classes["nav-bottom"]}`}>
          <button
            type='button'
            onClick={handleLightMode}
            className={`${classes["nav-link"]} ${classes["nav-button"]}`}
            aria-label={
              lightMode ? "Switch to dark mode" : "Switch to light mode"
            }
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
