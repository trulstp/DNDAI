import React from "react";
import Nav from "../Components/Nav/Nav";
import BigCard from "../Components/UI/Cards/BigCard";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../store/sidebar-provider";

const Root = () => {
  return (
    <React.Fragment>
      <SidebarProvider>
        <Nav />
        <BigCard>
          <Outlet />
        </BigCard>
      </SidebarProvider>
    </React.Fragment>
  );
};

export default Root;
