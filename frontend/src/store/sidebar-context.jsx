import { createContext } from 'react';

export const SidebarContext = createContext({
    sidebarOpen: false,
    handleSidebar: () => {},
    lightMode: false,
    handleLightMode: () => {},
    hover: false,
    handleHover: () => {},
    handleHoverOff: () => {},
    previousChats: [],
    setPreviousChats: () => {},
    previousEncounter: [],
    setPreviousEncounter: () => {},
});

