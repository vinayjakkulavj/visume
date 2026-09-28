# Visume · Vinay Jakkula

A cinematic, six-slide data engineering portfolio with smooth chapter navigation, animated backgrounds, resume evidence dialogs, and optional synthesized sound. No API key, database, login, or resume upload is required.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run build
npm start
```

Open http://localhost:4173. After editing the source, run `npm run build` and refresh the page.

## Project structure

- `src/App.tsx`: resume slides, chapter navigation, evidence, and contact links.
- `src/hooks/useCinema.ts`: wheel, touch, keyboard navigation, and canvas motion.
- `src/audio/CinemaAudio.ts`: synthesized sound effects. Sound starts only after the visitor enables it.
- `src/components/ui/`: accessible Radix dialog and button components.
- `src/lib/utils.ts`: class-name helpers.
- `src/styles.css`: complete existing design stylesheet, including compiled utility styles.
- `public/images/`: the three WebP background images.
- `scripts/build.mjs`: builds the website and regenerates the single-file export.
- `scripts/serve.mjs`: local preview server.
- `dist/`: generated website, excluded from Git.
- `standalone/index.html`: complete downloadable website with embedded images, styles, and scripts.

## Slides

1. Introduction
2. The journey
3. Cloud migration
4. AI and lineage
5. Performance
6. What I bring to your team

The build verifies all six slides and writes their content directly into the HTML before attaching React interactions.

## Hosting

For any static host, run `npm run build` and publish the contents of `dist/`. Paths are relative so the site can also run under a repository subdirectory.

For a single-file host, upload `standalone/index.html`. This file can also be opened directly in a modern desktop browser.

For an existing Lovable project, place the standalone file at `public/visume.html` in its connected repository and link to `/visume.html`. The source project here uses a small standalone React build, not Lovable-specific services.

## Editing

Edit resume wording in `src/App.tsx`, motion in `src/hooks/useCinema.ts`, sound in `src/audio/CinemaAudio.ts`, and styling in `src/styles.css`. Replace images using the existing filenames or update references and the build's image list. Rebuild before hosting or sharing the standalone export.

Images illustrate achievements conceptually. Achievement figures reflect the supplied resume and are not guarantees of future results. Respect the visitor's reduced-motion preference; sound remains optional.
