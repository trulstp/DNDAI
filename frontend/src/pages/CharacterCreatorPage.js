import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React, { useState, useEffect, useContext } from "react";
import Feed from "../Components/UI/Feed/Feed";
import Loading from "../Components/UI/Loading/Loading";
import { SidebarContext } from "../store/sidebar-context";

const CharacterCreatorPage = () => {
  const sidebarCtx = useContext(SidebarContext);

  return (
    <>
      <Sidebar button={"+ New Character"} />
    </>
  );
};

export default CharacterCreatorPage;

//Some testing,
