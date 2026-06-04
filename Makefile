# System Design Primer — Astro + Starlight (T3 / U2 / RT-11)
# Package manager is npm (T2 / S2).

.PHONY: install run build preview check

# Install dependencies (produces/uses package-lock.json).
install:
	npm install

# Dev server with a browser tab auto-opened (U2 / RT-2: --open).
run: install
	npm run dev -- --open

# Static production build to ./dist (T4 / RT-11).
build: install
	npm run build

# Preview the built static site locally.
preview: install
	npm run preview

# Type-check the project.
check: install
	npm run check
