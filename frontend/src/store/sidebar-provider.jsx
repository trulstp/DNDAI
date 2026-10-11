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

const isQuotaError = (error) =>
    error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED';

// Saves a history list (oldest first). Returns null when it fits as it is; otherwise
// { list, imagesRemoved, entriesRemoved } for what had to be given up to make it fit, or
// { failed: true } when it couldn't be saved at all.
// Artwork takes most of the space, so the oldest artwork goes first, then the oldest results.
// Favourites and the newest result are never removed; their artwork is the last thing to go.
const saveHistory = (key, history) => {
    const trySave = (list) => {
        try {
            localStorage.setItem(key, JSON.stringify(list));
            return true;
        } catch (error) {
            if (!isQuotaError(error)) throw error;
            return false;
        }
    };

    try {
        if (trySave(history)) return null;

        const newestId = history[history.length - 1]?.id;
        const kept = (entry) => entry.favorite || entry.id === newestId;
        const hasImages = (entry) => entry.images?.length > 0;
        let list = history;
        const withoutImages = (id) => list.map((x) => (x.id === id ? { ...x, images: [] } : x));
        const without = (id) => list.filter((x) => x.id !== id);
        // Each step gives up one more thing, in the order they should go
        const steps = [
            ...history.filter((e) => !kept(e) && hasImages(e)).map((e) => () => withoutImages(e.id)),
            ...history.filter((e) => !kept(e)).map((e) => () => without(e.id)),
            ...history.filter((e) => kept(e) && hasImages(e)).map((e) => () => withoutImages(e.id)),
        ];

        for (const step of steps) {
            list = step();
            if (trySave(list)) {
                const ids = new Set(list.map((e) => e.id));
                return {
                    list,
                    entriesRemoved: history.length - list.length,
                    imagesRemoved: history.filter(
                        (e) => ids.has(e.id) && hasImages(e) && !hasImages(list.find((x) => x.id === e.id)),
                    ).length,
                };
            }
        }
    } catch {
        // Storage unavailable (blocked or private browsing)
    }
    return { failed: true };
};

const plural = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;

// Explains what saving had to give up, or null when nothing was lost
const describeTrim = (result, noun) => {
    if (!result) return null;
    if (result.failed) {
        return `Your browser isn't letting Support Roll save, so new ${noun}s will be lost when you leave the page.`;
    }
    const { entriesRemoved: entries, imagesRemoved: images } = result;
    const lost = [
        entries > 0 && `the ${entries === 1 ? `oldest ${noun} was` : `${entries} oldest ${noun}s were`} removed`,
        images > 0 && `artwork was removed from ${plural(images, `older ${noun}`)}`,
    ].filter(Boolean);
    return `Browser storage is full, so ${lost.join(', and ')}. Favourites are always kept. Delete ${noun}s you don't need to make room.`;
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

// History list that persists across page reloads. When storage is full, the list is trimmed
// to what could be saved and onNotice explains what was removed
const usePersistentHistory = (key, noun, onNotice) => {
    const [history, setHistory] = useState(() => loadHistory(key));

    useEffect(() => {
        const result = saveHistory(key, history);
        if (!result) return;
        if (result.list) setHistory(result.list);
        onNotice(describeTrim(result, noun));
        // onNotice is a state setter, so it never changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, noun, history]);

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

    // Explains what was lost when browser storage ran out
    const [storageNotice, setStorageNotice] = useState(null);
    const dismissStorageNotice = () => setStorageNotice(null);

    const [previousChats, setPreviousChats] = usePersistentHistory('supportroll.characters', 'character', setStorageNotice);

    const [previousEncounter, setPreviousEncounter] = usePersistentHistory('supportroll.encounters', 'encounter', setStorageNotice);

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
        <SidebarContext.Provider value={{ sidebarOpen, historyAvailable, handleSidebar, closeSidebar, navExpanded, setNavHovered, setNavFocused, lightMode, handleLightMode, previousChats, setPreviousChats, previousEncounter, setPreviousEncounter, storageNotice, dismissStorageNotice }}>
            {children}
        </SidebarContext.Provider>
    );
};
