# Support Roll

**An AI-powered toolkit for Dungeons & Dragons Dungeon Masters.**

Support Roll helps you prep a session in seconds. Pick a location and a challenge rating to roll a balanced combat encounter, or choose a race and class to generate a ready-to-play character. You get rules-based numbers, AI-written flavour text and AI-generated artwork.

---

## Features

### 🐉 Random Encounter Generator
- Choose from 48 locations (caves, the Underdark, graveyards, volcanoes, elven cities, …) and a challenge rating from 1 to 24.
- The backend picks a random group of monsters native to that location whose combined CR fits the budget.
- OpenAI turns the group into a full encounter write-up:
  - **Title**, **Location** (terrain, weather, time of day, lighting)
  - **Monsters** (appearance, motives, tactics)
  - **Obstacles & hazards**, **Allied NPCs**, **Treasure & rewards**
  - **Random twists**, **Mood & atmosphere**
- Click **Generate Image?** to create a landscape illustration of the scene.
- Every section can be collapsed, and a sidebar keeps the encounters from the current session.

### 🧙 Character Creator
- Pick a name, race (Dragonborn, Dwarf, Elf, Gnome, Half-Elf, Half-Orc, Halfling, Human, Tiefling), class (Cleric, Fighter, Rogue, Wizard) and level (1–3). Leave a field empty and it's chosen at random.
- A Python generator rolls the mechanics: ability scores, hit points, racial traits, skills, saving throws, equipment, languages and spells.
- OpenAI adds the story: personality, ideals, bonds, flaws, trinkets, quirks and a backstory.
- Click **Generate Image?** to create a portrait of the character.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App), React Router 6, react-select, CSS Modules, Font Awesome |
| Backend | Node.js, Express 4, Mongoose 7 |
| Database | MongoDB (monster catalogue) |
| AI | OpenAI Chat Completions with function/tool calling for structured JSON, OpenAI Images (`gpt-image-1-mini`) |
| Image processing | `sharp` (converts images to AVIF) |
| Character rules engine | Python 3 (`backend/scripts/Class_creator.py`) |

---

## How It Works

```
┌──────────────┐   1. location + CR    ┌──────────────┐   query    ┌──────────┐
│              │ ────────────────────▶ │              │ ─────────▶ │ MongoDB  │
│    React     │ ◀──── monster list ── │   Express    │ ◀───────── │ monsters │
│   frontend   │                       │   backend    │            └──────────┘
│              │   2. monsters +       │              │  function   ┌──────────┐
│              │      location ──────▶ │              │  calling ─▶ │  OpenAI  │
│              │ ◀── encounter JSON ── │              │ ◀────────── │          │
│              │   3. image prompt ──▶ │              │ ──────────▶ │  Images  │
│              │ ◀──── AVIF image ──── │  (sharp)     │ ◀────────── │          │
└──────────────┘                       └──────┬───────┘             └──────────┘
                                              │ spawn
                                       ┌──────▼───────┐
                                       │   Python     │  character mechanics
                                       │ Class_creator│  (stats, HP, spells…)
                                       └──────────────┘
```

---

## Project Structure

```
DNDAI/
├── backend/
│   ├── server.js              # Express app, CORS, MongoDB connection, HTTP/HTTPS
│   ├── routes/
│   │   ├── dndRoutes.js       # /app/* endpoints
│   │   └── userRoutes.js      # /user/* (placeholder)
│   ├── controller/
│   │   └── dndController.js   # Encounter, character and image logic
│   ├── models/
│   │   ├── DnDSchema.js       # Monster schema
│   │   └── userSchema.js      # User schema (not yet used)
│   ├── services/
│   │   └── open5eClient.js    # Cached Open5e API client (work in progress)
│   ├── scripts/
│   │   └── Class_creator.py   # Character generator
│   └── data/
│       └── locationTags.json
└── frontend/
    ├── netlify.toml
    ├── public/
    └── src/
        ├── App.js             # Routes
        ├── pages/             # Route-level pages
        ├── Components/        # Nav, Feed, CharacterSheet, inputs, UI kit
        └── store/             # Sidebar / session-history context
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or newer
- [Python 3](https://www.python.org/), available as `python3` on your PATH
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone the repository
```bash
git clone https://github.com/trulstp/DNDAI.git
cd DNDAI
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
DATABASE_ACCESS=mongodb+srv://<user>:<password>@<cluster>/<db>
OPENAI_API_KEY=sk-...
PORT=4000
USE_HTTPS=false
# Only needed when USE_HTTPS=true
# SSL_KEY_PATH=/path/to/key.pem
# SSL_CERT_PATH=/path/to/cert.pem
```

Start the server:
```bash
npm start
```
The API is now at `http://localhost:4000`.

> MongoDB is optional at startup: the server still runs without it, but the encounter endpoints need it.

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Create `frontend/.env` (optional; defaults to `http://localhost:4000`):
```env
REACT_APP_API_BASE_URL=http://localhost:4000
```

Start the dev server:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Add monsters to the database
The encounter generator needs a monster catalogue. Add monsters by posting one object or an array of objects:

```bash
curl -X POST http://localhost:4000/app/register \
  -H "Content-Type: application/json" \
  -d '[
    { "monsterName": "Goblin", "challengeRating": 1, "setting": "Forgotten Realms", "location": "forests, caves", "groupTag": "Goblinoid" },
    { "monsterName": "Beholder", "challengeRating": 13, "setting": "Forgotten Realms", "location": "underdark", "groupTag": "Beholder" }
  ]'
```

---

## API Reference

All endpoints are under `/app`.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Add one monster or an array of monsters |
| `GET` | `/all` | List every monster |
| `GET` | `/location?location=underdark` | Monsters at a location |
| `GET` | `/locations` | Distinct locations in the database |
| `GET` | `/encounter?location=underdark&challengeRating=9` | Random monster group that fits the CR budget |
| `POST` | `/schematic` | `{ message: { monsters, location } }` → structured encounter JSON |
| `POST` | `/create-character` | `{ name, race, classType, level }` → character mechanics JSON |
| `POST` | `/openaiCharacter` | `{ message: { name, race, class, level, alignment, stats, skills } }` → personality and backstory JSON |
| `POST` | `/images` | `{ message: prompt }` → landscape AVIF image (1536×1024) |
| `POST` | `/images2` | `{ message: prompt }` → portrait AVIF image (1024×1536) |
| `POST` | `/completions` | `{ message }` → plain chat completion |

---

## Roadmap

- [ ] User accounts (login, register, profile; UI exists, backend pending)
- [ ] Save encounters and characters to the user's profile
- [ ] Non-combat encounter generator
- [ ] Map maker
- [ ] Monster data from the [Open5e API](https://open5e.com/)
- [ ] Light mode theme
- [ ] More classes and higher character levels

---

## Author

**Truls Teige Pettersen** – [@trulstp](https://github.com/trulstp)

## Disclaimer

Support Roll is an unofficial fan project. *Dungeons & Dragons* is a trademark of Wizards of the Coast; this project is not affiliated with or endorsed by Wizards of the Coast.
