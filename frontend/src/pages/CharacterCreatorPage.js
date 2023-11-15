import Sidebar from "../Components/UI/Sidebar/Sidebar";
import React from "react";
import Feed from "../Components/UI/Feed/Feed";
import Loading from "../Components/UI/Loading/Loading";

const CharacterCreatorPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Feed></Feed>
      <Loading></Loading>
    </>
  );
};

export default CharacterCreatorPage;

//Some testing,
