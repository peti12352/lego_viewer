import {
  initViewer,
  getScene,
  getCamera,
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
const autoPlayBtn = document.getElementById("autoPlayBtn");

let model = null;
let currentStep = 0;
let totalSteps = 0;

let isAutoPlaying = false;
let autoPlayIntervalId = null;
const AUTO_PLAY_INTERVAL = 1500;

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
    stopAutoPlay();
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

        const viewerContainer = document.getElementById("viewerContainer");
        if (model && viewerContainer) {
          frameArea(model, getCamera(), getControls(), viewerContainer, true);
        }

        applyStepVisibility(currentStep);

        updateStepInfo(currentStep, totalSteps, model);
        updateButtonStates(currentStep, totalSteps, model, false);
        showLoader(false);
      },
      (error) => {
        displayError(error);
        showLoader(false);
        updateButtonStates(currentStep, totalSteps, model, false);
      }
    );
  }
}

function onPrevStep() {
  stopAutoPlay();
  if (currentStep > 1 && model) {
    currentStep--;
    applyStepVisibility(currentStep);
    console.log(`[Main] Set step to: ${currentStep}`);
    updateStepInfo(currentStep, totalSteps, model);
    updateButtonStates(currentStep, totalSteps, model, isAutoPlaying);
  }
}

function onNextStep(isTriggeredByAutoPlay = false) {
  if (!isTriggeredByAutoPlay) {
    stopAutoPlay();
  }
  if (currentStep < totalSteps && model) {
    currentStep++;
    applyStepVisibility(currentStep);
    console.log(`[Main] Set step to: ${currentStep}`);
    updateStepInfo(currentStep, totalSteps, model);
    updateButtonStates(currentStep, totalSteps, model, isAutoPlaying);

    if (isAutoPlaying && currentStep >= totalSteps) {
      stopAutoPlay(true);
    }
  }
}

function startAutoPlay() {
  if (isAutoPlaying || !model || totalSteps === 0) return;

  isAutoPlaying = true;
  console.log("[Main] Auto-play started.");
  updateButtonStates(currentStep, totalSteps, model, isAutoPlaying);

  if (currentStep === 0 && totalSteps > 0) {
    onNextStep(true);
  }

  if (currentStep >= totalSteps) {
    stopAutoPlay(true);
    return;
  }

  autoPlayIntervalId = setInterval(() => {
    onNextStep(true);
  }, AUTO_PLAY_INTERVAL);
}

function stopAutoPlay(completed = false) {
  if (!isAutoPlaying && !completed && autoPlayIntervalId === null) return;

  clearInterval(autoPlayIntervalId);
  autoPlayIntervalId = null;
  isAutoPlaying = false;
  console.log(`[Main] Auto-play stopped. Completed: ${completed}`);
  updateButtonStates(currentStep, totalSteps, model, isAutoPlaying);
}

function handleAutoPlay() {
  if (!model || totalSteps === 0) return;

  if (isAutoPlaying) {
    stopAutoPlay();
  } else {
    if (currentStep >= totalSteps) {
      currentStep = 0;
      applyStepVisibility(currentStep);
      updateStepInfo(currentStep, totalSteps, model);
    }
    startAutoPlay();
  }
}

function onResetView() {
  const viewerContainer = document.getElementById("viewerContainer");
  if (model && viewerContainer) {
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
    autoPlayBtn,
    onFileSelected,
    onPrevStep,
    onNextStep,
    onResetView,
    onAutoPlay: handleAutoPlay,
  });
  updateButtonStates(currentStep, totalSteps, model, false);
});
