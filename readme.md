# Progress Tracker System

Progress Tracker System is a React-based coding practice and progress tracking application designed to help students organize DSA problems, monitor solving consistency, and track preparation progress.

## Overview

The app runs entirely in the browser. Each user can create a local account and maintain a personal problem library without a server or external service.

## Features

- Browser-local account creation and sign-in
- Add, edit, search, filter, sort, and delete coding problems
- Track platform, link, topic, difficulty, notes, and status
- Mark problems solved or move them back to To do
- Dashboard totals for solved problems, weekly progress, streak, and recent solved items
- Intentional empty states for a new tracker
- Light and dark themes
- Responsive layout for desktop, tablet, and mobile screens
- Confirmation before deletion and feedback after changes

## Tech stack

- React
- Vite
- Tailwind CSS
- Lucide React
- Web Crypto API for browser-side password hashing

## How to run

From the repository root, open PowerShell and run:

```powershell
cd web-app/frontend
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Create an account with a username and password of at least eight characters, then start adding problems.

To create a production build:

```powershell
npm.cmd run build
```

## Data storage

Accounts, the current session, theme preference, and problems are stored in the browser's `localStorage`. Data is not uploaded or synchronized between devices. Clearing site data removes the local tracker.

This local-first approach is intentionally simple for the current version and should not be used for sensitive production data.

## Project evolution

The project began as the C++ command-line application in [Tracker.cpp](Tracker.cpp), which stores questions in [tracker_data.csv](tracker_data.csv) and is launched with [run_tracker.bat](run_tracker.bat). The React application in `web-app/frontend` is the browser-based evolution of that same preparation-tracking idea. The original CLI files remain functional at the repository root.

## Screenshots

Add current screenshots at these paths:

- Dashboard: `docs/screenshots/dashboard.png`
- Problem Tracker: `docs/screenshots/problem-tracker.png`
- Analytics: `docs/screenshots/analytics.png`

## Future improvements

- Optional export and backup of local tracker data
- Analytics based on saved problems and solving history
- Spaced revision scheduling based on actual problem activity
- Optional synchronization across devices
