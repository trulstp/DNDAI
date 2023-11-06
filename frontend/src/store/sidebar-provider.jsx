import React, { useState, useContext } from 'react';
import { SidebarContext } from './sidebar-context';

export const SidebarProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [lightMode, setLightMode] = useState(false);

    const handleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLightMode = () => {
        setLightMode(!lightMode);
    }

    return (
        <SidebarContext.Provider value={{ sidebarOpen, handleSidebar, lightMode, handleLightMode }}>
            {children}
        </SidebarContext.Provider>
    );
};
