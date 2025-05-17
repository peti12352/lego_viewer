# LEGO Step-by-Step Viewer

A web application for visualizing LEGO LDraw models step-by-step in a 3D environment, powered by Three.js.

## Features

- Supports loading of `.ldr` and `.mpd` LDraw model files.
- Interactive step-by-step navigation through the building process.
- Standard 3D view controls: rotate, pan, and zoom.
- Responsive user interface, adaptable to various screen sizes.

## Project Structure

```
lego_viewer/
├── index.html              # Main application page
├── package.json            # Project metadata and scripts (for Tailwind CSS)
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration (for Tailwind CSS)
├── .gitignore              # Specifies intentionally untracked files for Git
├── src/
│   ├── main.js           # Application entry point: initializes and connects modules
│   ├── viewer.js         # Manages the Three.js scene, camera, renderer, and user controls
│   ├── ldrawLoader.js    # Handles LDraw file loading, parsing, and parts library integration
│   └── ui.js             # Manages user interface elements, event handling, and DOM updates
├── styles/
│   ├── tailwind-input.css  # Source CSS file with Tailwind directives and custom styles
│   └── main.css          # Generated, optimized CSS file (output of Tailwind build)
├── test_models/            # Directory for LDraw test model files
└── README.md               # This file
```

## Code Overview

The application is structured into several JavaScript modules within the `src/` directory:

- `main.js`: Orchestrates the application, setting up the viewer and UI components, and managing file loading.
- `viewer.js`: Encapsulates all Three.js related logic, including scene setup, camera configuration, rendering loop, and 3D interaction controls.
- `ldrawLoader.js`: Implements the LDraw file loading capabilities using Three.js's `LDrawLoader`. It integrates with an external LDraw parts library to render models accurately.
- `ui.js`: Handles all user interface interactions, such as file selection, step navigation, and displaying messages or errors to the user.

## How to Run Locally

This project relies on ES modules (requiring an HTTP/S server) and a build step for optimizing Tailwind CSS.

1.  **Clone the Repository (if you haven't already):**

    ```bash
    git clone <repository-url>
    cd lego_viewer
    ```

2.  **Install Dependencies:**
    This project uses `npm` to manage development dependencies for Tailwind CSS.

    ```bash
    npm install
    ```

3.  **Build CSS:**
    Generate the optimized `styles/main.css` file using Tailwind CLI.

    ```bash
    npm run build:css
    ```

    (Alternatively, `npm run build` which currently also just runs `build:css`)
    _Note: You need to re-run this command if you make changes to `styles/tailwind-input.css` or add/remove Tailwind classes in your HTML/JS files to see those changes._

4.  **Serve the Files:**
    Use a local HTTP server. Here are a few common options:

    - **Using Python:**

      ```bash
      python -m http.server 8000
      ```

      Then open `http://localhost:8000` in your browser.

    - **Using Node.js (with `serve`):**

      ```bash
      npx serve .
      ```

      This will typically serve the site on `http://localhost:3000` (check terminal output).

    - **Using VS Code Live Server:**
      The "Live Server" extension can serve `index.html` (ensure it serves after CSS is built if you are making CSS changes).

## Deploying to Vercel

This project can be easily deployed to [Vercel](https://vercel.com/) for free.

1.  **Push your project to GitHub:** Ensure all your code, including the `package.json`, `tailwind.config.js`, `postcss.config.js`, your `.gitignore` file, and your generated `styles/main.css` (after running `npm run build:css`), is pushed to a GitHub repository.

2.  **Import Project to Vercel:**

    - Sign up or log in to Vercel using your GitHub account.
    - Click "Add New..." -> "Project".
    - Import your `lego_viewer` GitHub repository.

3.  **Configure Project Settings on Vercel:**

    - **Framework Preset:** Vercel will likely detect it as "Other" or allow you to select it. This is fine for a static site with a custom build step.
    - **Build and Output Settings (Located under Project Settings -> General -> Build & Development Settings):**
      - **Build Command:** Set this to `npm run build` (or `npm run build:css`). Vercel will run this command after installing dependencies from your `package.json`.
      - **Output Directory:** This setting is **CRUCIAL** for your project.
        - **Why?** Vercel, by default for "Other" frameworks or static sites, looks for a directory named `public` to serve your files from. Your project's `index.html` is at the root, and your build command generates CSS in place (`styles/main.css`).
        - **How to fix:** You must override Vercel's default. In the "Output Directory" field in your Vercel project settings, you have a few options:
          1.  **Enter `.` (a single dot):** This explicitly tells Vercel to use the root of your repository as the output directory.
          2.  **Clear the field:** If the field has a default value (like `public`), try deleting it completely so it's empty. Some platforms interpret an empty output directory field as the project root.
        - **Verification:** After changing this setting, redeploy your project. The error "No Output Directory named 'public' found" means Vercel is _still_ not recognizing the root as the output. Double-check this setting carefully in your Vercel dashboard.
      - **Install Command:** This can usually be left as Vercel's default (e.g., `npm install` or `yarn install` if you were using Yarn), as it will detect your `package.json`.

4.  **Deploy:** Click the "Deploy" button.

Vercel will then install dependencies, run your build command, and (if the Output Directory is correctly set) deploy the contents from your project root.

**Troubleshooting Vercel Deployment:**

- **Error: "No Output Directory named 'public' found"**: This is the most common issue for projects like this. It means the "Output Directory" setting in Vercel (Project Settings -> General -> Build & Development Settings) is not correctly pointing to your project's root. Ensure it is set to `.` or is empty, as described above. Make sure you save the changes in Vercel and trigger a new deployment.
- **Outdated `caniuse-lite` warning (`Browserslist: caniuse-lite is outdated`):** This is a warning from Tailwind CSS related to browser compatibility data. While good to update eventually (`npx update-browserslist-db@latest` locally if desired, then commit `package-lock.json`), it does _not_ cause the "No Output Directory" error and shouldn't stop a successful deployment if the output directory is configured correctly.

## Usage Guide

1.  Ensure the application is running locally (see "How to Run Locally").
2.  Open the provided URL in your web browser.
3.  Click the "Choose File" button and select a LEGO LDraw model file (`.ldr` or `.mpd`) from your computer.
4.  Once the model loads, use the "Previous Step" and "Next Step" buttons to navigate through the building sequence.
5.  Interact with the 3D model:
    - **Rotate:** Click and drag with the left mouse button.
    - **Pan:** Click and drag with the right mouse button (or use a two-finger drag on touchpads).
    - **Zoom:** Use the mouse scroll wheel (or pinch-to-zoom on touch devices).

## Dependencies & Technologies

- **[Three.js](https://threejs.org/):** Core 3D graphics library (loaded via CDN through an import map).
- **[LDrawLoader](https://threejs.org/docs/#examples/en/loaders/LDrawLoader):** Three.js loader for LDraw files (loaded via CDN).
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework. Used via a local build process (`npm run build:css`) for optimized production CSS.
  - Development dependencies: `tailwindcss`, `postcss`, `autoprefixer` (managed via `package.json`).

## Known Limitations

- **LDraw File Compatibility:**

  - The viewer works best with **packed MPD files** (Multi-Part Document files where all sub-models and parts are embedded). Unpacked models or files with missing/non-standard parts may not load correctly or completely, potentially resulting in errors like "No geometry found."
  - Step-by-step navigation is entirely dependent on the presence and correctness of `0 STEP` commands and part metadata within the LDraw file. Models without this information will be displayed as a single, complete assembly.

- **Part Loading Performance:**

  - For models that are not packed, individual LDraw part files (`.dat`) are fetched remotely from the `gkjohnson/ldraw-parts-library` on GitHub. For models with many unique parts, this can lead to slow initial loading times. Using packed MPD files significantly improves loading speed as part data is embedded.

- **Viewer Controls & Initial Framing:**

  - The 3D view uses `OrbitControls`, allowing the user to rotate around, pan across, and zoom into the model. It does not offer first-person or "fly-through" style navigation.
  - When a model is loaded, it is automatically framed to fit the view. The initial camera angle for this framing is predetermined to provide a comprehensive overview and is not user-configurable. However, users can freely orbit and adjust the view thereafter.

- **Performance with Large Models:**

  - Very large or highly complex LDraw models (e.g., those with tens of thousands of parts or extremely detailed geometries) may strain browser resources, potentially leading to reduced performance or responsiveness.

- **Online Requirement:**
  - The application requires an active internet connection to fetch the Three.js library (and its sub-modules like `LDrawLoader`) and the LDraw parts library.

## Acknowledgements

- This project utilizes the **LDraw Parts Library** hosted by Garrett Johnson ([gkjohnson/ldraw-parts-library on GitHub](https://github.com/gkjohnson/ldraw-parts-library)) for rendering LEGO model parts.
- The LDraw file format and community resources at [LDraw.org](https://www.ldraw.org/) are fundamental to this project.

## Notes

- A stable internet connection is required for full functionality (see Online Requirement).
- This project is designed for modern web browsers with good WebGL support.
- When developing locally, ensure you run the build command (`npm run build:css`) after making style changes or modifying HTML/JS class usage to see those changes reflected in the browser.
