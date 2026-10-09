import React, { useState, useEffect } from 'react';
import { SidebarContext } from './sidebar-context';

const loadHistory = (key) => {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};

// Saves a history list, dropping the oldest entries if it doesn't fit in storage
const saveHistory = (key, history) => {
    for (let start = 0; start <= history.length; start++) {
        try {
            localStorage.setItem(key, JSON.stringify(history.slice(start)));
            return;
        } catch {
            // Quota exceeded or storage unavailable; retry without the oldest entry
        }
    }
};

// History list that persists across page reloads
const usePersistentHistory = (key) => {
    const [history, setHistory] = useState(() => loadHistory(key));

    useEffect(() => {
        saveHistory(key, history);
    }, [key, history]);

    return [history, setHistory];
};

export const SidebarProvider = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [lightMode, setLightMode] = useState(false);

    const [hover, setHover] = useState(false);

    const [previousChats, setPreviousChats] = usePersistentHistory('supportroll.characters');

    const [previousEncounter, setPreviousEncounter] = usePersistentHistory('supportroll.encounters');

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
