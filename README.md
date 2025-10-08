# Pre-Mortem Workshop Planner

A single-page React + TypeScript app for running pre-mortem workshops. Capture the full worksheet, persist it to localStorage, and export the final plan to PDF.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## PDF export

Use the **Export to PDF** button to generate an A4 PDF snapshot of the worksheet directly in the browser. The export relies on `html2canvas` and `jsPDF`.
