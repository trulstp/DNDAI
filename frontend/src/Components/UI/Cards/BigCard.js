import React, { useContext } from "react";
import classes from "./BigCard.module.css";

import { SidebarContext } from "../../../store/sidebar-context";

const BigCard = (props) => {
  const { sidebarOpen, navExpanded } = useContext(SidebarContext);

  // The page moves aside for the open history sidebar or the expanded nav, so nothing covers its text
  const className =
    sidebarOpen || navExpanded ? classes["with-sidebar"] : classes.collapsed;

  return <div className={className}>{props.children}</div>;
};

export default BigCard;
