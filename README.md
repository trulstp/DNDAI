# Support Roll

[![CI](https://github.com/trulstp/DNDAI/actions/workflows/ci.yml/badge.svg)](https://github.com/trulstp/DNDAI/actions/workflows/ci.yml)

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
| Frontend | React 18 (Vite), React Router 6, CSS Modules, Font Awesome |
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
├── .nvmrc                     # Node version (24)
├── backend/
│   ├── server.js              # MongoDB connection, HTTP/HTTPS, clean shutdown
│   ├── app.js                 # Express app: CORS, body limit, rate limits, routes, /health
│   ├── Dockerfile             # Container with Node 24 and Python 3, for hosting
│   ├── routes/
│   │   └── dndRoutes.js       # /app/* endpoints
│   ├── controller/
│   │   └── dndController.js   # Encounter, character and image logic, request checks
│   ├── middleware/
│   │   └── limits.js          # Rate limits and the daily cap on AI requests
│   ├── util/
│   │   └── promptSignature.js # Signs image prompts so only the app's own are drawn
│   ├── models/
│   │   ├── DnDSchema.js       # Monster schema
│   │   ├── statblockSchema.js # SRD stat blocks from Open5e
│   │   └── usageSchema.js     # AI requests per day, for the daily cap
│   ├── services/
│   │   └── open5eClient.js    # Open5e API client used by the sync script
│   ├── scripts/
│   │   ├── Class_creator.py   # Character generator
│   │   ├── seedMonsters.js    # Loads data/monsterSeed.js into MongoDB
│   │   └── syncOpen5e.js      # Copies SRD stat blocks from Open5e into MongoDB
│   ├── data/
│   │   └── monsterSeed.js     # Monsters per location
│   └── test/                  # npm test
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── netlify.toml
    ├── public/
    └── src/
        ├── App.jsx            # Routes
        ├── pages/             # Route-level pages
        ├── Components/        # Nav, Feed, CharacterSheet, inputs, UI kit
        ├── store/             # History, sidebar and theme context
        └── util/              # Small shared helpers
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 24 (with nvm, run `nvm use` in the repo to pick it up from `.nvmrc`)
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

Optional settings, mostly for a deployed server:

| Variable | Default | What it does |
|---|---|---|
| `CORS_ORIGINS` | `http://localhost:3000,https://supportroll.netlify.app` | Sites allowed to call the API, comma separated |
| `TRUST_PROXY` | `0` | Number of proxies in front of the server, so rate limits see each visitor's own IP |
| `CLIENT_IP_HEADER` | not set | A header with the visitor's IP set by the proxy in front, e.g. `CF-Connecting-IP` behind Cloudflare (Render). Used instead of `TRUST_PROXY` when set |
| `DEBUG_CLIENT_IP` | `false` | `true` adds `GET /debug/client-ip`, showing which IP the rate limits see. For setting up a host only |
| `AI_LIMIT_PER_HOUR` | `20` | AI requests per visitor per hour. An encounter or character with artwork is two |
| `AI_LIMIT_PER_DAY` | `150` | AI requests per day for all visitors together, counted in MongoDB |
| `PROMPT_SIGNING_SECRET` | derived from `OPENAI_API_KEY` | Key for signing image prompts |

Start the server:
```bash
npm start
```
The API is now at `http://localhost:4000`.
Use `npm run dev` instead to restart the server automatically when a file changes.

Run the backend tests with `npm test`. GitHub Actions runs them on every pull request too, along with the frontend build and a check that the Docker image starts (`.github/workflows/ci.yml`).

> MongoDB is optional at startup: the server still runs without it, but the encounter endpoints need it.

### 3. Set up the frontend
```bash
cd ../frontend
npm install
```

Create `frontend/.env` (optional; defaults to `http://localhost:4000`):
```env
VITE_API_BASE_URL=http://localhost:4000
```

Start the dev server:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000).

### 4. Add monsters to the database
The encounter generator needs a monster catalogue. Load it from `backend/data/monsterSeed.js` (safe to re-run), then copy the SRD stat blocks from Open5e:

```bash
cd ../backend
node scripts/seedMonsters.js
node scripts/syncOpen5e.js
```

### 5. Run the backend in Docker (optional)
The backend ships with a `Dockerfile`, which is how it's hosted. It bundles Node 24 and Python 3, so nothing else needs to be installed:

```bash
cd backend
docker build -t supportroll-backend .
docker run --env-file .env -p 4000:4000 supportroll-backend
```

Docker's `--env-file` needs `KEY=value` lines without spaces around the `=`.

---

## API Reference

All endpoints are under `/app`, except `GET /health`, which returns `{ "status": "ok", "database": "connected" }` for the host's health checks.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/encounter?location=underdark&challengeRating=9` | Random monster group that fits the CR budget |
| `GET` | `/statblocks?names=Wraith,Mummy` | SRD stat blocks by monster name |
| `POST` | `/create-character` | `{ name, race, classType, level }` → character mechanics JSON |
| `POST` | `/schematic` | `{ message: { monsters, location, challengeRating } }` → structured encounter JSON, with `poster_signature` |
| `POST` | `/openaiCharacter` | `{ message: { name, race, class, level, alignment, stats, skills } }` → personality and backstory JSON, with `portrait_signature` |
| `POST` | `/images` | `{ message: poster_description, signature: poster_signature }` → landscape AVIF image (1536×1024) |
| `POST` | `/images2` | `{ message: character_portrait, signature: portrait_signature, race, characterClass }` → portrait AVIF image (1024×1536) |

### Protecting the OpenAI routes
The last four routes call OpenAI, so they're guarded:
- **Request checks.** Locations, races, classes and the other fields must be values the app itself sends, so free text can't be slipped into the prompts. Bodies over 20 KB are refused.
- **Signed image prompts.** The server signs each image description it writes (HMAC-SHA256), and the image routes only draw descriptions with a valid signature. They can't be used as a general-purpose image generator.
- **Rate limits.** Each visitor gets `AI_LIMIT_PER_HOUR` AI requests an hour, and all visitors together `AI_LIMIT_PER_DAY` a day. Rejected requests don't count.
- **Timeouts and errors.** OpenAI calls time out after 90 seconds (text) or 2 minutes (images), and errors never include internal details.

---

## Roadmap

- [ ] User accounts (login, register, profile)
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
