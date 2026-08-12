(() => {
  const deck = document.querySelector("#demoDeck");
  const scenes = [...document.querySelectorAll(".scene")];
  const phaseSteps = [...document.querySelectorAll("[data-phase-step]")];
  const sceneCount = document.querySelector("#sceneCount");
  const scenePhase = document.querySelector("#scenePhase");
  const sceneTitle = document.querySelector("#sceneTitle");
  const previousButton = document.querySelector("#previousScene");
  const nextButton = document.querySelector("#nextScene");
  const startButton = document.querySelector("#startDemo");
  const returnButton = document.querySelector("#returnPresentation");
  const returnHint = document.querySelector("#returnHint");
  const phases = ["auth", "admin", "owner", "customer", "complete"];
  let activeIndex = 0;
  let started = false;

  function updateChrome(scene) {
    const phase = scene.dataset.phase || "auth";
    const phaseIndex = phases.indexOf(phase);
    phaseSteps.forEach((step) => {
      const index = phases.indexOf(step.dataset.phaseStep);
      step.classList.toggle("is-active", index === phaseIndex);
      step.classList.toggle("is-complete", index < phaseIndex);
    });

    const heading = scene.querySelector("h1, h2");
    sceneCount.textContent = `${String(activeIndex).padStart(2, "0")} / ${String(scenes.length - 1).padStart(2, "0")}`;
    scenePhase.textContent = phase.toUpperCase();
    sceneTitle.textContent =
      heading?.textContent?.trim() || "RestoManager demo";
    previousButton.disabled = activeIndex <= 1;
    nextButton.disabled = activeIndex >= scenes.length - 1;
  }

  function showScene(nextIndex) {
    if (!started && nextIndex > 0) {
      started = true;
      deck.classList.add("is-started");
    }
    const bounded = Math.max(
      started ? 1 : 0,
      Math.min(nextIndex, scenes.length - 1),
    );
    scenes.forEach((scene, index) => {
      scene.classList.toggle("is-active", index === bounded);
      scene.classList.toggle("is-past", index < bounded);
      scene.setAttribute("aria-hidden", String(index !== bounded));
    });
    activeIndex = bounded;
    updateChrome(scenes[activeIndex]);
  }

  function next() {
    if (!started) return showScene(1);
    if (activeIndex < scenes.length - 1) showScene(activeIndex + 1);
  }

  function previous() {
    if (started && activeIndex > 1) showScene(activeIndex - 1);
  }

  startButton.addEventListener("click", () => showScene(1));
  nextButton.addEventListener("click", next);
  previousButton.addEventListener("click", previous);

  returnButton.addEventListener("click", () => {
    returnHint.classList.add("is-visible");
    window.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    const isFormControl =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement;
    if (isFormControl) return;

    if (event.key === "ArrowRight" || event.code === "Space") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
  });

  showScene(0);
})();
