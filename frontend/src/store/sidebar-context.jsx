import { createContext } from 'react';

export const SidebarContext = createContext({
    sidebarOpen: false,
    handleSidebar: () => {},
    lightMode: false,
    handleLightMode: () => {},
});

