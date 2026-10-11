// "underground cities" -> "Underground Cities"
export const titleCase = (text = "") =>
  text.replace(/\b\w/g, (c) => c.toUpperCase());

// "Wraith, 2× Mummy, 2× Wolf" from the monsters rolled for an encounter, lead monster first
export const summariseMonsters = (monsters = []) => {
  const counts = new Map();
  for (const monster of monsters) {
    const name = monster?.monsterName ?? monster;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => (count > 1 ? `${count}× ${name}` : name))
    .join(", ");
};
