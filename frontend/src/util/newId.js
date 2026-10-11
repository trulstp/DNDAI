// Unique id for a saved encounter or character, so items with the same title stay separate
export const newId = () =>
  window.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
