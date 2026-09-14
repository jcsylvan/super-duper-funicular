# College Application Tracker

A single-page tracker for the 2026–27 application cycle (entering Fall 2027).
Open `index.html` in a browser — no build step or server required.

## Layout and theme

- Styled after the board game Clue: a mahogany frame, green felt board,
  parchment "room" cards outlined in ink, and the six suspects' colours for
  application status (Mrs. White for Researching, Colonel Mustard for In
  Progress, Mrs. Peacock for Submitted, Mr. Green for Accepted, Miss Scarlet
  for Rejected, Professor Plum for Waitlisted).
- On desktop the whole tracker fits the browser window with no page scrolling:
  a one-line header with the counts, one toolbar row, and the table filling
  the rest (with a sticky header, it scrolls inside its own frame only if the
  list outgrows the window).
- **My Profile** and the **Preference Ranker** open as drop-down panels from
  the toolbar instead of stacking above the table. Click outside or press
  Escape to close them.
- Each college is a single compact row; the checklist appears as the
  detective's **Notebook** column, and application types are abbreviated
  (RD, EA, REA, ED, ED II) with the full name on hover.
- Below tablet width the board switches back to a normal scrolling page.

## Features

- Tracks 26 seeded colleges with 2027-cycle deadlines and admissions metrics.
- **Preference Ranker** — drag-and-drop (or arrows) to rank colleges by personal preference.
- Fit scoring against your GPA / SAT / ACT profile.
- Add, edit, delete, bulk-add, search, filter, and sort.
- All edits, rankings, and your profile are saved in the browser via `localStorage`.
- **Export / Import** JSON backups to preserve and move your data between devices.
