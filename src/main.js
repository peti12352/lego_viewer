import {
  initViewer,
  getScene,
  getCamera,
  getRenderer,
  getControls,
  frameArea,
} from "./viewer.js";
import { loadLDrawFile } from "./ldrawLoader.js";
import {
  setupUI,
  updateStepInfo,
  updateButtonStates,
  showLoader,
  clearError,
  displayError,
} from "./ui.js";

// DOM elements
const fileInput = document.getElementById("fileInput");
const prevStepBtn = document.getElementById("prevStepBtn");
const nextStepBtn = document.getElementById("nextStepBtn");
const resetViewBtn = document.getElementById("resetViewBtn");

let model = null;
let currentStep = 0;
let totalSteps = 0;

function applyStepVisibility(step) {
  if (!model) return;
  console.log(
    `[Main] Applying visibility for step: ${step}. Total steps: ${totalSteps}`
  );

  model.traverse((child) => {
    if (child.userData && child.userData.buildingStep !== undefined) {
      // LDrawLoader sets buildingStep to a number (1-indexed)
      child.visible = child.userData.buildingStep <= step;
    } else if (totalSteps === 0 && child.isMesh) {
      // If no steps defined, ensure all mesh children are visible
      // (LDrawLoader might create non-mesh groups too, only make meshes visible)
      child.visible = true;
    }
  });
  // Special case: if we are at step 0 (meaning before first step or no steps), and totalSteps > 0, hide everything with a buildingStep
  if (step === 0 && totalSteps > 0) {
    model.traverse((child) => {
      if (child.userData && child.userData.buildingStep !== undefined) {
        child.visible = false;
      }
    });
  }
  // If totalSteps is 0, everything relevant should have been made visible by the first traversal logic.
}

function onFileSelected(event) {
  const file = event.target.files[0];
  if (file) {
    showLoader(true);
    clearError();
    loadLDrawFile(
      file,
      getScene(),
      (loadedModel, steps) => {
        model = loadedModel;
        totalSteps = steps;
        currentStep = totalSteps > 0 ? 1 : 0;

        console.log(
          `[Main] Model loaded. Total steps: ${totalSteps}. Initial currentStep: ${currentStep}`
        );

        // Frame the loaded model and enable auto-rotate initially
        const viewerContainer = document.getElementById("viewerContainer");
        if (model && viewerContainer) {
          frameArea(model, getCamera(), getControls(), viewerContainer, true);
        }

        applyStepVisibility(currentStep);

        updateStepInfo(currentStep, totalSteps, model);
        updateButtonStates(currentStep, totalSteps, model);
        showLoader(false);
      },
      (error) => {
        displayError(error);
        showLoader(false);
        updateButtonStates(currentStep, totalSteps, model);
      }
    );
  }
}

function onPrevStep() {
  if (currentStep > 1 && model) {
    currentStep--;
    applyStepVisibility(currentStep);
    console.log(`[Main] Set step to: ${currentStep}`);
    updateStepInfo(currentStep, totalSteps, model);
    updateButtonStates(currentStep, totalSteps, model);
  }
}

function onNextStep() {
  if (currentStep < totalSteps && model) {
    currentStep++;
    applyStepVisibility(currentStep);
    console.log(`[Main] Set step to: ${currentStep}`);
    updateStepInfo(currentStep, totalSteps, model);
    updateButtonStates(currentStep, totalSteps, model);
  }
}

function onResetView() {
  const viewerContainer = document.getElementById("viewerContainer");
  if (model && viewerContainer) {
    // Call frameArea, false for autoRotate to not restart it on manual reset
    frameArea(model, getCamera(), getControls(), viewerContainer, false);
    console.log("[Main] View reset by user.");
  } else {
    console.log("[Main] Reset view called but no model loaded.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initViewer();
  setupUI({
    fileInput,
    prevStepBtn,
    nextStepBtn,
    resetViewBtn,
    onFileSelected,
    onPrevStep,
    onNextStep,
    onResetView,
  });
});
