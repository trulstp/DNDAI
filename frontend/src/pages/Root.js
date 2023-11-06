import React from "react";
import Nav from "../Components/Nav/Nav";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../store/sidebar-provider";

const Root = () => {
  return (
    <React.Fragment>
      <SidebarProvider value={{ sidebarOpen: false }}>
        <Nav />
        <Outlet />
      </SidebarProvider>
    </React.Fragment>
  );
};

export default Root;
