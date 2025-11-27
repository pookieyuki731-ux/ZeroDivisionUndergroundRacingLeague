---
description: How to update and deploy the website
---
# Update and Deploy Workflow

This workflow describes how to make changes to the website locally, verify them, and deploy the updates to GitHub Pages.

## Prerequisites
- Node.js installed (already set up)
- Dependencies installed (`npm install`)

## Steps

1. **Start Local Server**
   Run the development server to see your changes in real-time.
   ```powershell
   npm run dev
   ```
   Open your browser to the URL shown (usually `http://localhost:5173/ZeroDivisionUndergroundRacingLeague/`).

2. **Make Changes**
   Edit the files in the `src` directory. The browser will automatically reload with your changes.

3. **Deploy to GitHub Pages**
   Once you are happy with your changes, run the following command to build and deploy the site.
   ```powershell
   npm run deploy
   ```
   This command will:
   - Build the project (`npm run build`)
   - Push the `dist` folder to the `gh-pages` branch on GitHub.

4. **Verify Deployment**
   Visit your live GitHub Pages site to see the updates (it may take a few minutes to update).
