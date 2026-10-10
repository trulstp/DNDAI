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

const THEME_KEY = 'supportroll.theme';

// Saved choice first, otherwise follow the device's light/dark setting
const initialLightMode = () => {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved === 'light';
    } catch {
        // Storage unavailable; fall through to the device setting
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
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

    const [lightMode, setLightMode] = useState(initialLightMode);

    // index.css switches every theme colour on this attribute
    useEffect(() => {
        document.documentElement.dataset.theme = lightMode ? 'light' : 'dark';
    }, [lightMode]);

    const [hover, setHover] = useState(false);

    const [previousChats, setPreviousChats] = usePersistentHistory('supportroll.characters');

    const [previousEncounter, setPreviousEncounter] = usePersistentHistory('supportroll.encounters');

    const handleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Only an explicit choice is saved, so until then the app keeps following the device setting
    const handleLightMode = () => {
        const next = !lightMode;
        setLightMode(next);
        try {
            localStorage.setItem(THEME_KEY, next ? 'light' : 'dark');
        } catch {
            // Storage unavailable; the theme still applies for this visit
        }
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
