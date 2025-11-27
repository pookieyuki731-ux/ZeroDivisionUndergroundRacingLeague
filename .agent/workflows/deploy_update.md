---
description: How to update and deploy the website
---

# How to Update Your Website

Follow these steps whenever you want to push changes to the live website.

1.  **Make your changes**
    Edit your code, add features, fix bugs, etc.

2.  **Test locally**
    Run `npm run dev` and check that everything works as expected on `http://localhost:5173`.

3.  **Save your changes to Git**
    Open a new terminal and run:
    ```powershell
    git add .
    git commit -m "Describe your changes here"
    git push
    ```
    *This saves your code to your GitHub repository.*

4.  **Deploy to the live website**
    Run:
    ```powershell
    npm run deploy
    ```
    *This builds your website and updates the live version on GitHub Pages.*

5.  **Verify**
    Visit your website link to see the changes (it may take 1-2 minutes to update).
