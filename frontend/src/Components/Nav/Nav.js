import React from "react";
import classes from "./Nav.module.css";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className={classes.navbar}>
      <ul className={["navbar-nav"]}>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test1
          </Link>
        </li>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test2
          </Link>
        </li>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test3
          </Link>
        </li>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test4
          </Link>
        </li>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test5
          </Link>
        </li>
        <li className={["nav-item"]}>
          <Link to='/' className={["nav-link"]}>
            Test6
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
