import React, { useState } from 'react';
import { SidebarContext } from './sidebar-context';

export const SidebarProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [lightMode, setLightMode] = useState(false);

    const [hover, setHover] = useState(false);

    const [previousChats, setPreviousChats] = useState([]);

    const [previousEncounter, setPreviousEncounter] = useState([]);

    const handleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLightMode = () => {
        setLightMode(!lightMode);
    }

const handleHover = () => {
    setHover(true);
}
const handleHoverOff = () => {
    setHover(false);
}

    return (
        <SidebarContext.Provider value={{ sidebarOpen, handleSidebar, lightMode, handleLightMode, hover, handleHover, handleHoverOff, previousChats, setPreviousChats, previousEncounter, setPreviousEncounter }}>
            {children}
        </SidebarContext.Provider>
    );
};
