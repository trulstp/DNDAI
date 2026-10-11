import React, { useContext } from "react";
import classes from "./BigCard.module.css";

import { SidebarContext } from "../../../store/sidebar-context";

const BigCard = (props) => {
  const { sidebarOpen } = useContext(SidebarContext);

  // Only the open history sidebar takes space; the nav expands over the page on hover
  const className = sidebarOpen ? classes["with-sidebar"] : classes.collapsed;

  return <div className={className}>{props.children}</div>;
};

export default BigCard;
