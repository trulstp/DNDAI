import React, { useState } from 'react';
import { SidebarContext } from './sidebar-context';

export const SidebarProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [lightMode, setLightMode] = useState(false);

    const [hover, setHover] = useState(false);

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
        <SidebarContext.Provider value={{ sidebarOpen, handleSidebar, lightMode, handleLightMode, hover, handleHover, handleHoverOff }}>
            {children}
        </SidebarContext.Provider>
    );
};
