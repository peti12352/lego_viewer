export function setupUI({
  fileInput,
  prevStepBtn,
  nextStepBtn,
  resetViewBtn,
  autoPlayBtn,
  onFileSelected,
  onPrevStep,
  onNextStep,
  onResetView,
  onAutoPlay,
}) {
  fileInput.addEventListener("change", onFileSelected);
  prevStepBtn.addEventListener("click", onPrevStep);
  nextStepBtn.addEventListener("click", onNextStep);
  resetViewBtn.addEventListener("click", onResetView);
  autoPlayBtn.addEventListener("click", onAutoPlay);
}

export function updateStepInfo(currentStep, totalSteps, model) {
  const stepInfo = document.getElementById("stepInfo");
  if (totalSteps > 0) {
    stepInfo.textContent = `Step ${currentStep} of ${totalSteps}`;
  } else if (model && model.children.length > 0) {
    stepInfo.textContent = "Model loaded (no steps)";
  } else {
    stepInfo.textContent = "No model loaded";
  }
}

export function updateButtonStates(
  currentStep,
  totalSteps,
  model,
  isAutoPlaying = false
) {
  const prevStepBtn = document.getElementById("prevStepBtn");
  const nextStepBtn = document.getElementById("nextStepBtn");
  const autoPlayBtn = document.getElementById("autoPlayBtn");

  const noModelOrNoSteps = !model || totalSteps === 0;

  prevStepBtn.disabled = noModelOrNoSteps || currentStep <= 1 || isAutoPlaying;
  nextStepBtn.disabled =
    noModelOrNoSteps || currentStep >= totalSteps || isAutoPlaying;

  if (autoPlayBtn) {
    autoPlayBtn.classList.toggle("hidden", !model || !model.children.length);
    autoPlayBtn.disabled = noModelOrNoSteps;

    if (isAutoPlaying) {
      updateAutoPlayButtonText("Pause");
    } else if (currentStep >= totalSteps && totalSteps > 0) {
      updateAutoPlayButtonText("Replay");
    } else {
      updateAutoPlayButtonText("Play");
    }
  }
}

export function updateAutoPlayButtonText(text, isDisabled = undefined) {
  const autoPlayBtn = document.getElementById("autoPlayBtn");
  if (autoPlayBtn) {
    autoPlayBtn.textContent = text;
    if (isDisabled !== undefined) {
      autoPlayBtn.disabled = isDisabled;
    }
  }
}

export function showLoader(show) {
  const loaderOverlay = document.getElementById("loaderOverlay");
  loaderOverlay.classList.toggle("hidden", !show);
}

export function displayError(message) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove("hidden");
  console.error(message);
}

export function clearError() {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.classList.add("hidden");
  errorMessageElement.textContent = "";
}
