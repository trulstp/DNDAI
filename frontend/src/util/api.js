import { useSyncExternalStore } from "react";

export const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// The backend's free hosting plan puts it to sleep after 15 idle minutes, and the first request
// after that waits up to a minute while it starts. The page wakes it as soon as it opens, and
// loading screens explain the wait if waking takes a while.

// Treat the server as possibly asleep after this long without a response
const ASSUME_ASLEEP_AFTER_MS = 10 * 60 * 1000;
// An awake server answers well within this, so a slower answer means it's starting up
const SLOW_AFTER_MS = 3000;

let lastResponseAt = 0;
let checking = false;
let waking = false;
const listeners = new Set();

const setWaking = (value) => {
  if (waking === value) return;
  waking = value;
  listeners.forEach((listener) => listener());
};

// Called whenever the backend answers, whatever the status: it's awake
export const noteServerResponse = () => {
  lastResponseAt = Date.now();
  setWaking(false);
};

// Pings the health check unless the server answered recently. Safe to call often
export function wakeServer() {
  if (checking || Date.now() - lastResponseAt < ASSUME_ASLEEP_AFTER_MS) return;
  checking = true;
  const slow = setTimeout(() => setWaking(true), SLOW_AFTER_MS);
  fetch(`${API}/health`, { cache: "no-store" })
    .then(noteServerResponse)
    .catch(() => setWaking(false))
    .finally(() => {
      clearTimeout(slow);
      checking = false;
    });
}

// True while the server is taking a while to wake up
export const useServerWaking = () =>
  useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => waking,
  );
