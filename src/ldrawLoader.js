import { LDrawLoader } from "https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/LDrawLoader.js";
import { displayError, showLoader } from "./ui.js";

const LIBRARY_BRANCH_OR_TAG = "master";

export async function loadLDrawFile(file, scene, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = async function (event) {
    const fileContent = event.target.result;
    // Remove previous model if any
    let oldModel = scene.getObjectByName("LDrawModel");
    if (oldModel) scene.remove(oldModel);

    const ldrawLoader = new LDrawLoader();
    // Use a more complete parts library and preload materials
    const partsLibraryPath = `https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/${LIBRARY_BRANCH_OR_TAG}/complete/ldraw/`;
    ldrawLoader.setPartsLibraryPath(partsLibraryPath);

    try {
      console.log(
        "[LDrawLoader] Preloading materials from LDraw Parts Library..."
      );
      await ldrawLoader.preloadMaterials(
        `https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/colors/ldcfgalt.ldr`
      );
      console.log("[LDrawLoader] Materials preloaded successfully.");

      console.log(
        "[LDrawLoader] Parsing file content:",
        fileContent.slice(0, 500)
      );

      ldrawLoader.parse(
        fileContent,
        function (groupNode) {
          console.log("[LDrawLoader] Parse result:", groupNode);

          // Correct LDraw model orientation for Three.js scene
          groupNode.rotation.x = Math.PI / -2;
          console.log(
            "[LDrawLoader] Applied initial X-axis rotation to model."
          );

          if (
            !groupNode ||
            !groupNode.children ||
            groupNode.children.length === 0
          ) {
            console.error(
              "[LDrawLoader] Loaded groupNode is null or has no children."
            );
            displayError(
              "Model loaded, but no geometry found. This may be due to missing parts from the LDraw library or an issue with the model file. Please ensure you are using a standard LDraw file and try a packed MPD if issues persist."
            );
            showLoader(false);
            if (onError) onError("No geometry found");
            return;
          }
          console.log("[LDrawLoader] groupNode:", groupNode);
          console.log(
            "[LDrawLoader] groupNode.userData:",
            JSON.stringify(groupNode.userData, null, 2)
          );
          groupNode.name = "LDrawModel";
          scene.add(groupNode);
          let steps = 0;
          // Use the actual property name found in userData
          if (groupNode.userData.numBuildingSteps !== undefined) {
            steps = groupNode.userData.numBuildingSteps;
            console.log(`[LDrawLoader] Detected numBuildingSteps: ${steps}`);
          } else if (groupNode.userData.numConstructionSteps !== undefined) {
            // Fallback for older name
            steps = groupNode.userData.numConstructionSteps;
            console.log(
              `[LDrawLoader] Detected numConstructionSteps (fallback): ${steps}`
            );
          } else {
            console.warn(
              "[LDrawLoader] Neither numBuildingSteps nor numConstructionSteps is defined."
            );
          }

          // Fade-in effect (optional, can be improved)
          // Ensure materials are transparent for fade-in to work
          groupNode.traverse((c) => {
            if (c.isMesh) {
              // Make a copy if material is shared to avoid affecting other objects
              if (Array.isArray(c.material)) {
                c.material = c.material.map((m) => {
                  const mat = m.clone();
                  mat.transparent = true;
                  mat.opacity = 0;
                  return mat;
                });
              } else {
                c.material = c.material.clone();
                c.material.transparent = true;
                c.material.opacity = 0;
              }
            }
          });
          let opacity = 0;
          const fadeInInterval = setInterval(() => {
            groupNode.traverse((c) => {
              if (c.isMesh) {
                if (Array.isArray(c.material)) {
                  c.material.forEach((m) => (m.opacity = Math.min(opacity, 1)));
                } else {
                  c.material.opacity = Math.min(opacity, 1);
                }
              }
            });
            opacity += 0.1;
            if (opacity >= 1) clearInterval(fadeInInterval);
          }, 50);

          onSuccess(groupNode, steps);
        },
        undefined, // onProgress callback for parse
        function (error) {
          console.error("[LDrawLoader] Detailed parse error:", error);
          console.error(
            "[LDrawLoader] Error loading or parsing LDraw file in ldrawLoader.parse. Error:",
            error && error.message ? error.message : error
          );
          displayError(
            "Failed to parse LDraw model. The file might be corrupted or not a valid LDraw format."
          );
          showLoader(false);
          if (onError) onError(error);
        }
      );
    } catch (preloadError) {
      console.error("[LDrawLoader] Error preloading materials:", preloadError);
      displayError(
        "Failed to preload essential LDraw materials. Check your internet connection or contact support if the issue persists."
      );
      showLoader(false);
      if (onError) onError(preloadError);
    }
  };
  reader.onerror = function (error) {
    console.error("[LDrawLoader] Error reading file:", error);
    displayError("Error reading the selected file.");
    showLoader(false); // Ensure loader is hidden on file read error
    if (onError) onError("Error reading file"); // Pass a generic error message
  };
  reader.readAsText(file);
}
