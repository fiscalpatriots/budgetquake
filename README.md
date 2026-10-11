# Budgetquake: a playable first month

Budgetquake is a budgeting game for eighth graders, built so a teacher can see how each student reasoned. This repository holds a prototype of its first month.

A student picks one of three households, takes that household's paycheck, and plays seven decision cards: payday, rent, two bills, food, something the household wants, and a surprise cost. Every choice asks for a one-sentence reason before the game moves on. The month ends with the balances, what was paid late or put off, and the student's own reasons read back. A teacher view lists every decision with its reason and ranks the three a teacher would raise in class.

## Running it

Open `index.html` in any current browser. It is one file with its styles and script inside, makes no network requests (its content security policy forbids them), and stores nothing, so it runs from a saved copy with no internet connection. The Spanish button switches every visible line; the Spanish text is a prototype of the planned language support.

## What it is not yet

One month of six, with fixed events. The full game adds five more months, events chosen to test each student's own budget, reviewed coaching notes, a class view behind a class code, and a final household the student has not seen. `DEMO-NOTES.md` lists what this prototype does and what it leaves for later.

## Checks

The scripts in `tools/` drive the page in a headless Microsoft Edge on Windows:

- `node tools/serve.cjs . 8931` serves the folder locally.
- `node tools/paths.cjs` plays every choice path for every household (7,290 months) and confirms that the line items in "Every dollar this month" add up to the closing balance each time.
- `node tools/offline.cjs` opens the page from disk, plays a month, and reports how many network requests it made (zero) and what it stored (nothing).
- `node tools/shoot.cjs screenshots/<date> 320,375,768,1024,1280,1600` saves a full-page image of every screen at each width and records any sideways overflow, clipped text, or tap target under 44 pixels.

## License

Released under the license in `LICENSE`.
