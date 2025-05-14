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
├── index.html          # Main application page
├── src/
│   ├── main.js         # Application entry point: initializes and connects modules
│   ├── viewer.js       # Manages the Three.js scene, camera, renderer, and user controls
│   ├── ldrawLoader.js  # Handles LDraw file loading, parsing, and parts library integration
│   └── ui.js           # Manages user interface elements, event handling, and DOM updates
├── styles/
│   └── main.css        # Custom styles (utilizes Tailwind CSS via CDN)
└── README.md           # This file
```

## Code Overview

The application is structured into several JavaScript modules within the `src/` directory:

- `main.js`: Orchestrates the application, setting up the viewer and UI components, and managing file loading.
- `viewer.js`: Encapsulates all Three.js related logic, including scene setup, camera configuration, rendering loop, and 3D interaction controls.
- `ldrawLoader.js`: Implements the LDraw file loading capabilities using Three.js's `LDrawLoader`. It integrates with an external LDraw parts library to render models accurately.
- `ui.js`: Handles all user interface interactions, such as file selection, step navigation, and displaying messages or errors to the user.

## How to Run Locally

This project relies on ES modules, which require it to be served over HTTP/S.

1.  **Navigate to the project directory:**

    ```bash
    cd lego_viewer
    ```

2.  **Serve the files using a local HTTP server.** Here are a few common options:

    - **Using Python:**

      ```bash
      python -m http.server 8000
      ```

      Then open `http://localhost:8000` in your browser.

    - **Using Node.js (with `serve`):**
      If you have Node.js installed, you can use the `serve` package:

      ```bash
      npx serve .
      ```

      This will typically serve the site on `http://localhost:3000` (check terminal output for the exact URL).

    - **Using VS Code Live Server:**
      If you are using Visual Studio Code, the "Live Server" extension provides an easy way to serve the `index.html` file.

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

- **[Three.js](https://threejs.org/):** Core 3D graphics library (loaded via CDN).
- **[LDrawLoader](https://threejs.org/docs/#examples/en/loaders/LDrawLoader):** Three.js loader for LDraw files (included with Three.js examples, loaded via CDN).
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for styling (loaded via CDN).

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
  - The application requires an active internet connection to fetch the Three.js library, Tailwind CSS, and the LDraw parts library, all of which are loaded via CDNs or remote repositories.

## Acknowledgements

- This project utilizes the **LDraw Parts Library** hosted by Garrett Johnson ([gkjohnson/ldraw-parts-library on GitHub](https://github.com/gkjohnson/ldraw-parts-library)) for rendering LEGO model parts.
- The LDraw file format and community resources at [LDraw.org](https://www.ldraw.org/) are fundamental to this project.

## Notes

- A stable internet connection is required as the LDraw parts library and other dependencies are fetched remotely via CDN.
- This project is designed for modern web browsers with good WebGL support.
- No build process is necessary; all files are served statically.
