# Document Marking Scanner (for jcsylvan.ai/tools.html)

A new standalone tool for the Tools page, built to sit beside the Export License tools and the
NIS2 Requirement Tracker. It scans a folder of documents in the browser and produces a spreadsheet
that says, for each file, whether it carries an export control warning, whether it carries a CUI
(Controlled Unclassified Information) marking, and which US government contract number it cites.
The file name in each row is a hyperlink to the file.

The files in this folder are meant for the `jcsylvan.ai` site repository. They live here only
because this session could not reach that repository.

## Installing it on the site

1. Copy `doc-scanner.html` to the site root, next to `tools.html`, `export-screener.html` and
   `nis2-tracker.html`. It uses the site's `logo.png` for its icon and links back to `tools.html`.
2. Open `tools.html` and paste the contents of `tools-card.snippet.html` into the `<div class="tools">`
   list, after the Export License Screener card, so it sits with the export tools just above NIS2.
3. Nothing else to install. The page is one self-contained file and loads four libraries from
   public CDNs at view time: pdf.js (PDF text), JSZip (Word, PowerPoint, Excel), ExcelJS (writing
   the spreadsheet) and Tesseract.js (OCR, which also fetches its English language data).

## What the page does

- **Input:** drop a folder, click to choose one, or choose individual files. Subfolders are
  included by default. Files never leave the browser tab.
- **Reads:** `.pdf` (selectable text, and OCR for pages with little or none), `.docx` (body,
  headers, footers, tables, text boxes, footnotes), `.pptx` (slides, tables, speaker notes, masters
  and layouts), `.xlsx` (cell text, header/footer, text boxes), `.txt` and `.md`. Legacy `.doc`,
  `.ppt` and `.xls` are listed with a note asking for the modern format; other file types are
  counted and skipped. Office lock files and hidden files are ignored.
- **Flags:**
  - *Export control warning:* ITAR, EAR, the DoD export warning statement ("technical data whose
    export is restricted by the Arms Export Control Act…"), "export controlled", ECCN, EAR99,
    22 CFR 120–130, 15 CFR 730–774, USML, Commerce Control List, and similar. A bare "EAR" counts
    only with export wording nearby. The word "export" alone never counts.
  - *CUI label:* the `CUI` token (case-sensitive, so "cuisine" does not match), "Controlled
    Unclassified Information", "Controlled by:", CUI categories such as `SP-CTI`, dissemination
    controls, 32 CFR 2002, DoDI 5200.48. The old `FOUO` marking is reported in Notes, not counted.
  - *Contract number:* text after "Contract No.", "Contract Number", "Contract #", "Contract:" or
    "Award Number" wins; otherwise the first federal identifier by shape (`FA8650-20-C-1234`,
    `W911NF-19-2-0012`, no-hyphen `FA865020C1234`, NASA `80NSSC20C0123`, DOE `DE-AC02-05CH11231`).
    Other distinct numbers found go in a second column.
- **Output:** an on-page table plus `document-scan.xlsx` (sheets "Scan" and "Summary") and a CSV.
  Columns: File Name (hyperlink), Folder, File Type, Export Control Warning, CUI Label, Contract
  Number, Other Contract Numbers, Evidence (the text that fired), Notes, Path.
- **Links:** browsers hide a folder's location, so links are relative by default and work when the
  spreadsheet is saved in the folder that contains the scanned folder. Paste the folder's full path
  into the optional field and the links become absolute `file:///` links that work from anywhere on
  that computer (Windows, Mac and UNC paths are handled).
- **Rubik's cube:** the hero cube tumbles scrambled while idle, recolours a sticker with each
  file's result during a scan, and snaps to solved when the scan finishes. Results are shown as an
  unfolded cube net: white = unreadable, yellow = CUI, green = clean, blue = contract found,
  orange = read with OCR, red = export warning. Motion is disabled for users who prefer reduced
  motion.

## Limits worth knowing

- It is a keyword screen. "This document contains no CUI" still flags CUI; the Evidence column
  shows why, so a reviewer can judge.
- OCR runs only on pages with under 50 characters of selectable text, up to a per-file page cap
  (default 3), and is slow (a few seconds per page). A marking drawn as an image on an otherwise
  text page will be missed.
- Password-protected PDFs, zero-byte and corrupt files get a row with a note rather than stopping
  the scan.

## How it was verified

A headless Chromium run (Playwright) loaded the page, ran the detection rules against positive and
negative phrases, scanned a generated sample folder (Word with a CUI header, PowerPoint with the DoD
warning, Excel with a contract in a cell and CUI in the sheet header, text PDF, image-only PDF read
by OCR, password PDF, zero-byte, corrupt and legacy files, a subfolder and names with spaces), and
read the downloaded spreadsheet back to check every row, the hyperlinks, the frozen header and the
filter. It also checked the phone-width layout.
