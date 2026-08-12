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
  let controlsTimer;
  let startPending = false;

  const assetsReady = Promise.allSettled(
    [...document.images].map((image) => {
      image.loading = "eager";
      image.decoding = "async";
      if (image.complete) return image.decode?.() || Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }),
  );

  function revealControls() {
    deck.classList.remove("controls-idle");
    window.clearTimeout(controlsTimer);
    if (!started) return;
    controlsTimer = window.setTimeout(() => {
      deck.classList.add("controls-idle");
    }, 2200);
  }

  function updateChrome(scene) {
    const phase = scene.dataset.phase || "auth";
    const phaseIndex = phases.indexOf(phase);
    phaseSteps.forEach((step) => {
      const index = phases.indexOf(step.dataset.phaseStep);
      step.classList.toggle("is-active", index === phaseIndex);
      step.classList.remove("is-complete");
      if (index === phaseIndex) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });

    const heading = scene.querySelector("h1, h2");
    sceneCount.textContent = `${String(activeIndex).padStart(2, "0")} / ${String(scenes.length - 1).padStart(2, "0")}`;
    scenePhase.textContent = phase.toUpperCase();
    sceneTitle.textContent =
      heading?.textContent?.trim() || "RestoManager demo";
    previousButton.disabled = activeIndex <= 0;
    nextButton.disabled = activeIndex >= scenes.length - 1;
  }

  function showScene(nextIndex) {
    const bounded = Math.max(0, Math.min(nextIndex, scenes.length - 1));
    started = bounded > 0;
    if (!started) startPending = false;
    deck.classList.toggle("is-started", started);
    scenes.forEach((scene, index) => {
      scene.classList.toggle("is-active", index === bounded);
      scene.classList.toggle("is-past", index < bounded);
      scene.setAttribute("aria-hidden", String(index !== bounded));
    });
    if (document.activeElement?.closest?.(".scene:not(.is-active)")) {
      document.activeElement.blur();
    }
    deck.scrollTop = 0;
    deck.scrollLeft = 0;
    activeIndex = bounded;
    deck.classList.toggle(
      "is-cinematic",
      scenes[activeIndex].classList.contains("scene-handoff") ||
        scenes[activeIndex].classList.contains("scene-complete"),
    );
    updateChrome(scenes[activeIndex]);
    revealControls();
  }

  async function beginDemo() {
    if (startPending) return;
    startPending = true;
    startButton.setAttribute("aria-busy", "true");
    await assetsReady;
    startButton.removeAttribute("aria-busy");
    showScene(1);
  }

  function next() {
    if (!started) return beginDemo();
    if (activeIndex < scenes.length - 1) showScene(activeIndex + 1);
  }

  function previous() {
    if (activeIndex > 0) showScene(activeIndex - 1);
  }

  startButton.addEventListener("click", beginDemo);
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

    const nextKeys = ["ArrowRight", "ArrowDown", "PageDown"];
    const previousKeys = ["ArrowLeft", "ArrowUp", "PageUp"];

    if (nextKeys.includes(event.key) || event.code === "Space") {
      event.preventDefault();
      revealControls();
      next();
    } else if (previousKeys.includes(event.key)) {
      event.preventDefault();
      revealControls();
      previous();
    }
  });

  deck.addEventListener("pointermove", revealControls, { passive: true });
  deck.addEventListener("pointerdown", revealControls, { passive: true });

  showScene(0);
})();
