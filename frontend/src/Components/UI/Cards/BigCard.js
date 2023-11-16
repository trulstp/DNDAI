import React, { useContext } from "react";
import classes from "./BigCard.module.css";

import { SidebarContext } from "../../../store/sidebar-context";

const BigCard = (props) => {
  const { sidebarOpen, hover } = useContext(SidebarContext);

  const className = sidebarOpen || hover ? classes.bigcard : classes.hover;

  return <div className={className}>{props.children}</div>;
};

export default BigCard;
