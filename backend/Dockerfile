# The backend as a container: Node 24 plus Python 3 for the character generator
FROM node:24-slim

# Python's standard library is all Class_creator.py needs
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencies first, so this slow step is reused from the cache when only the code changes
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && rm -rf /root/.npm

COPY . .

ENV NODE_ENV=production
# The host sets PORT; this is the default when it doesn't
ENV PORT=4000
EXPOSE 4000

# An ordinary user, not root, so a hole in the app can't change the system
USER node

# Node runs directly (not through npm), so it receives SIGTERM and can shut down cleanly
CMD ["node", "server.js"]
