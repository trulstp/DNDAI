import React, { useContext } from "react";
import classes from "./BigCard.module.css";

import { SidebarContext } from "../../../store/sidebar-context";

const BigCard = (props) => {
  const { sidebarOpen, navExpanded } = useContext(SidebarContext);

  // The page moves aside for the open history sidebar or the expanded nav, so nothing covers its text
  const className =
    sidebarOpen || navExpanded ? classes["with-sidebar"] : classes.collapsed;

  // The page's main landmark, and the target of the "Skip to content" link
  return (
    <main id='main-content' tabIndex={-1} className={className}>
      {props.children}
    </main>
  );
};

export default BigCard;
