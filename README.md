# College Application Tracker

A single-page tracker for the 2026–27 application cycle (entering Fall 2027).
Open `index.html` in a browser — no build step or server required.

## Layout and theme

- Styled after the board game Clue: a mahogany frame, green felt, and the six
  suspects' colours for application status (Mrs. White for Researching,
  Colonel Mustard for In Progress, Mrs. Peacock for Submitted, Mr. Green for
  Accepted, Miss Scarlet for Rejected, Professor Plum for Waitlisted).
- **Board view (default):** the play area is the mansion's hallway grid and
  every college is a room with double walls and a door. Each room shows the
  preference rank on a plaque, the status as a coloured pawn, the location,
  the deadline (with an overdue or days-left tag), the fit badge, and the
  detective's notebook squares for the checklist. Click a room to edit it;
  hover for rank arrows, edit and delete. The confidential envelope in the
  middle of the board carries the case summary. The script picks the number
  of columns so the rooms fill the window without scrolling.
- **Ledger view:** the same colleges as a compact table with a sticky header.
  The Board / Ledger toggle in the toolbar remembers your choice.
- On desktop the whole tracker fits the browser window with no page
  scrolling: a one-line header with the counts, one toolbar row, and the
  board or ledger filling the rest.
- **My Profile** and the **Preference Ranker** open as drop-down panels from
  the toolbar. Click outside or press Escape to close them.
- Below tablet width the page scrolls normally and rooms flow two across.

## Features

- Tracks 26 seeded colleges with 2027-cycle deadlines and admissions metrics.
- **Preference Ranker** — drag-and-drop (or arrows) to rank colleges by personal preference.
- Fit scoring against your GPA / SAT / ACT profile.
- Add, edit, delete, bulk-add, search, filter, and sort.
- All edits, rankings, and your profile are saved in the browser via `localStorage`.
- **Export / Import** JSON backups to preserve and move your data between devices.
