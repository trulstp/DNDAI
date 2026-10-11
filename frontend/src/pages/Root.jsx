import React, { useEffect } from "react";
import Nav from "../Components/Nav/Nav";
import BigCard from "../Components/UI/Cards/BigCard";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../store/sidebar-provider";
import { StorageNotice } from "../Components/UI/Feedback/Feedback";
import { wakeServer } from "../util/api";

const Root = () => {
  // Start waking the backend while the visitor is still choosing what to make
  useEffect(wakeServer, []);

  return (
    <React.Fragment>
      <SidebarProvider>
        {/* First thing a keyboard user reaches; jumps past the nav to the page content */}
        <a
          href='#main-content'
          className='skip-link'
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("main-content")?.focus();
          }}
        >
          Skip to content
        </a>
        <Nav />
        <BigCard>
          <Outlet />
        </BigCard>
        <StorageNotice />
      </SidebarProvider>
    </React.Fragment>
  );
};

export default Root;
