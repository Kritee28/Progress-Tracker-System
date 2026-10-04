# Progress Tracker System

A small coding-practice tracker, evolved from my original C++ CLI project into a browser app. I built it to keep problem links, topics, difficulty, notes, and solved status together while preparing for technical interviews.

## Run the app

Only the frontend is needed. Open PowerShell in the project folder and run:

```powershell
cd web-app/frontend
npm.cmd install
npm.cmd run dev
```

Open the local address Vite prints, usually `http://localhost:5173`. In PowerShell, use `npm.cmd` so you do not need to change the script execution policy.

To make a production build:

```powershell
npm.cmd run build
```

## Using it

Create an account with a unique username and password, then add problems with a title, platform, optional URL, topic, difficulty, and notes. Search, filter, edit, delete, and mark problems solved from the tracker. The overview shows counts and recent solved work. Dark mode is available in the header.

## Data and privacy

This simplified version runs entirely in the browser. Accounts and problems are saved in the browser's local storage; passwords are hashed before saving. Usernames are unique within that browser profile. There is no AI service, backend server, or API call required. Data does not sync to another device and will be lost if browser storage is cleared, so this is intended for a local personal demo rather than production accounts.

## Original project

The original C++ CLI implementation remains in `Tracker.cpp`; `run_tracker.bat` launches the existing Windows build. The full-stack experiment remains under `web-app/backend/` as historical project code, but the simplified browser app does not use or require it.

## Stack

React, Vite, Tailwind CSS, and Lucide icons. No external services or database are needed to run the browser app.
