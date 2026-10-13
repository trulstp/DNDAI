# Writing the character engine

`backend/services/characterEngine.js` replaces the Python character script (`backend/scripts/Class_creator.py`). It builds characters from the SRD classes, races and spells that `backend/scripts/syncCharacterData.js` stores in MongoDB.

Each function has a comment saying what it should do. `abilityModifier` is already written as an example.

## Getting started

```bash
git checkout character-engine
cd backend
node --test test/characterEngine.test.js   # just the engine tests
npm test                                   # everything
```

Merge the `open5e-character-data` PR before opening the PR for this branch, because this branch is built on top of it.

## Suggested order

1. **Helpers:** `rollDie`, `pickSome`, `pickWeighted`. Everything else uses these.
2. **Ability scores:** `rollAbilityScores`, `assignAbilityScores`, `applyRacialIncreases`, `applyAbilityScoreImprovements`.
3. **Class:** `hitPoints`, `pickSkills`, `pickEquipment`, `featuresByLevel`.
4. **Spells:** `spellCounts`, `pickSpells`.
5. **Putting it together:** `createCharacter`.

## Tips

- **Finish a function, then remove its `{ todo: "..." }`** in `test/characterEngine.test.js`. From then on, a failure fails `npm test` and CI. While a test is still `todo`, look for `# TODO` in the output to see whether it passes.
- **Read the test before writing the function.** The fixed dice in the tests show exactly what's expected. For example, `rolls(6, 6, 6, 6, 1)` is four d6 that show 6, 6, 6 and 1.
- **Use `random`, never `Math.random()` directly.** Every function gets randomness passed in, so the tests can use fixed dice.
- **Don't change the lists you're given.** Copy before removing items. The Python script's `skilllist.remove(...)` changed the shared class data.
- **Commit as you go, in small steps.** It makes a good history to show.

## Rules data

`backend/data/characterRules.js` has the stat priorities, backgrounds and background weights from the Python script for cleric, fighter, rogue and wizard. The other eight classes are marked `TODO`. Which abilities and backgrounds suit a barbarian or a bard is a design choice for you to make.

## After the engine

- **Switch the `/create-character` route** in `backend/controller/dndController.js` from the Python script to `createCharacter`.
- **Load the data into memory once** (12 classes, 9 races, 319 spells) instead of querying MongoDB for every character. A query takes 130–580 ms; the engine itself takes under 1 ms.
- **Update the frontend's class list** in `frontend/src/Components/UI/InputSection/CharInput.jsx` and the backend's `CHARACTER_CLASSES` and `CHARACTER_LEVELS`.
- **Remove Python** from `backend/Dockerfile` and the README once nothing uses it.
