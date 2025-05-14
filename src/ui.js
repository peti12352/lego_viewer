export function setupUI({
  fileInput,
  prevStepBtn,
  nextStepBtn,
  resetViewBtn,
  onFileSelected,
  onPrevStep,
  onNextStep,
  onResetView,
}) {
  fileInput.addEventListener("change", onFileSelected);
  prevStepBtn.addEventListener("click", onPrevStep);
  nextStepBtn.addEventListener("click", onNextStep);
  resetViewBtn.addEventListener("click", onResetView);
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

export function updateButtonStates(currentStep, totalSteps, model) {
  const prevStepBtn = document.getElementById("prevStepBtn");
  const nextStepBtn = document.getElementById("nextStepBtn");
  prevStepBtn.disabled =
    !model || currentStep <= (totalSteps > 0 ? 1 : 0) || totalSteps === 0;
  nextStepBtn.disabled =
    !model || currentStep >= totalSteps || totalSteps === 0;
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
