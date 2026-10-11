import { createContext } from 'react';

export const SidebarContext = createContext({
    sidebarOpen: false,
    historyAvailable: false,
    handleSidebar: () => {},
    closeSidebar: () => {},
    lightMode: false,
    handleLightMode: () => {},
    previousChats: [],
    setPreviousChats: () => {},
    previousEncounter: [],
    setPreviousEncounter: () => {},
});

