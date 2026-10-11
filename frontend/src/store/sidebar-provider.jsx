import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarContext } from './sidebar-context';
import { newId } from '../util/newId';

// History saved before items had ids gets one per item. Older versions could also save the
// same item twice, so exact copies without an id are merged, keeping any image or favourite.
const upgradeHistory = (history) => {
    const legacyCopies = new Map();
    const upgraded = [];
    for (const entry of history) {
        if (!entry || typeof entry !== 'object') continue;
        if (entry.id) {
            upgraded.push(entry);
            continue;
        }
        const key = JSON.stringify([entry.title, entry.content ?? null, entry.first ?? null, entry.second ?? null]);
        const copy = legacyCopies.get(key);
        if (copy) {
            if (!copy.images?.length && entry.images?.length) copy.images = entry.images;
            copy.favorite = copy.favorite || entry.favorite;
            continue;
        }
        const withId = { ...entry, id: newId() };
        legacyCopies.set(key, withId);
        upgraded.push(withId);
    }
    return upgraded;
};

const loadHistory = (key) => {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        return Array.isArray(saved) ? upgradeHistory(saved) : [];
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

// Pages that have a history sidebar
const HISTORY_PAGES = ['/encounter', '/creator'];

export const SidebarProvider = ({ children }) => {
    // The user's choice; the sidebar only actually opens on pages that have one
    const [sidebarRequested, setSidebarRequested] = useState(false);
    const { pathname } = useLocation();
    const historyAvailable = HISTORY_PAGES.some((page) => pathname.startsWith(page));
    const sidebarOpen = sidebarRequested && historyAvailable;

    // The nav expands on hover or keyboard focus, and the page makes room for it
    // (except while the history sidebar is open, which already takes that space)
    const [navHovered, setNavHovered] = useState(false);
    const [navFocused, setNavFocused] = useState(false);
    const navExpanded = (navHovered || navFocused) && !sidebarOpen;

    const handleSidebar = () => setSidebarRequested((open) => !open);
    const closeSidebar = () => setSidebarRequested(false);

    // Escape closes the sidebar
    useEffect(() => {
        if (!sidebarOpen) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setSidebarRequested(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [sidebarOpen]);

    const [lightMode, setLightMode] = useState(initialLightMode);

    // index.css switches every theme colour on this attribute
    useEffect(() => {
        document.documentElement.dataset.theme = lightMode ? 'light' : 'dark';
    }, [lightMode]);

    const [previousChats, setPreviousChats] = usePersistentHistory('supportroll.characters');

    const [previousEncounter, setPreviousEncounter] = usePersistentHistory('supportroll.encounters');

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

    return (
        <SidebarContext.Provider value={{ sidebarOpen, historyAvailable, handleSidebar, closeSidebar, navExpanded, setNavHovered, setNavFocused, lightMode, handleLightMode, previousChats, setPreviousChats, previousEncounter, setPreviousEncounter }}>
            {children}
        </SidebarContext.Provider>
    );
};
