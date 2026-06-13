# Kids Jeopardy! 🎉

A kid-friendly, Jeopardy-style trivia game for **kindergarten and 1st grade** (ages ~5–7).
Built as a simple static web page with HTML, CSS, JavaScript, and Tailwind.

It can be played two ways:

- **In a browser** — just open `index.html` (no build step, no server).
- **As a Windows desktop app** — packaged with Electron into a single installer / portable
  `.exe`. All assets (Tailwind, confetti, fonts) are bundled locally in `vendor/`, so the
  desktop app works **fully offline**.

## How to play

1. Open **`index.html`** in any modern web browser (double-click it, or drag it into a browser
   tab). That's it — everything loads from CDNs.
2. **Add players** (1 to 6). Type each player's name, press **➕ Add Player** for more.
3. Press **START!**
4. Pick a category and point value (**10, 20, 50, 100** — harder as points go up).
5. The clue pops up full-screen and is **read aloud** automatically (tap 🔊 to hear it again).
6. A player **presses their colored button** to answer, then:
   - **Types** their answer (spelling doesn't have to be perfect!), **or**
   - Taps **"Show choices"** for big multiple-choice buttons.
7. ✅ Correct → confetti and points! ❌ Wrong → another player can try.
8. If nobody knows, press **⏭️ Skip to next question** to reveal the answer and move on.
9. When all 20 tiles are done, the **winner screen** shows scores and rains confetti.
   Press **PLAY AGAIN** to start fresh with new categories and questions.

## Kid-friendly design choices

- **No penalty** for wrong answers — other players just get a chance to steal.
- **Read-aloud** clues via the browser's built-in speech (great for early readers).
- **Forgiving answers:** minor misspellings are accepted (e.g. "kat" → cat), and numbers
  work as a digit *or* a word (e.g. "3" or "three").
- **Big, colorful touch targets** — works well on a tablet.

## Editing the questions

All content lives in **`js/questions.js`** in a single `QUESTION_POOL` array. Each category has
four point tiers (`10`, `20`, `50`, `100`); each tier is a list of candidate questions and one
is chosen at random per game. To add a question, copy an existing object:

```js
{ clue: "This farm animal says 'moo'.", answer: "cow", choices: ["cow", "dog", "duck", "pig"] }
```

- `clue` — the statement shown/read to players.
- `answer` — the plain word/phrase (no need for "What is…"; the checker handles that).
- `choices` — options for the "Show choices" fallback (include the correct answer).

Add as many categories or candidate questions as you like — the game shows **5 random
categories** per game, so a bigger pool means more variety.

## Building the Windows desktop app

The game is wrapped with [Electron](https://www.electronjs.org/) and packaged with
[electron-builder](https://www.electron.build/). From the project folder:

```sh
npm install        # one-time: installs Electron + electron-builder
npm start          # run the desktop app locally (dev)
npm run dist:win   # build the Windows installer + portable .exe
```

The build outputs to the **`release/`** folder:

| Artifact | What it is |
|----------|-----------|
| `Kids Jeopardy Setup <version>.exe` | NSIS installer — installs to Program Files / Start Menu, with a desktop shortcut |
| `KidsJeopardy-Portable-<version>.exe` | Single portable executable — no install, just double-click and play |

> **Note:** `npm run dist:win` must run on **Windows**, or on Linux/macOS with **Wine**
> installed (e.g. via the `electronuserland/builder:wine` Docker image). Building a Windows
> `.exe` requires Wine to assemble the executable.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure + local script/style includes |
| `css/styles.css` | Jeopardy-themed styling on top of Tailwind |
| `js/questions.js` | The editable question bank |
| `js/app.js` | Game logic (setup, board, clues, scoring, end screen) |
| `electron/main.js` | Electron main process (opens the desktop window) |
| `vendor/` | Locally bundled Tailwind, canvas-confetti, and fonts (offline support) |
| `build/icon.png` | App icon |
| `package.json` | npm scripts + electron-builder configuration |

## Notes

- The **desktop app works fully offline** — all libraries and fonts are bundled in `vendor/`.
- The **browser version** also loads everything from `vendor/`, so it works offline too.
- Read-aloud uses the browser's `speechSynthesis`; if a browser/device has it disabled, the game
  still works fully — just without audio.
