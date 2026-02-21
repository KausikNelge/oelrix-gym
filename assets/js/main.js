function selectAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function handleThemeToggle() {
  var toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  var prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  var stored = window.localStorage.getItem("ironforge-theme");
  var shouldUseLight = stored ? stored === "light" : prefersLight;

  document.body.classList.toggle("theme-light", shouldUseLight);
  toggle.setAttribute("aria-pressed", shouldUseLight ? "true" : "false");

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("theme-light");
    var isLight = document.body.classList.contains("theme-light");
    toggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    window.localStorage.setItem("ironforge-theme", isLight ? "light" : "dark");
  });
}


function handleNavToggle() {
  var nav = document.getElementById("mainNav");
  var toggle = document.getElementById("navToggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", function () {
    nav.classList.toggle("is-open");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.matches(".nav-link")) {
      nav.classList.remove("is-open");
    }
  });
}

function scrollToHash() {
  if (location.hash) {
    var target = document.querySelector(location.hash);
    if (!target) return;
    setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

function handleTrialPopup() {
  var overlay = document.getElementById("trialOverlay");
  if (!overlay) return;

  var openButtons = selectAll("[data-open-trial]");
  var closeElements = selectAll("[data-close-trial]", overlay);

  function open() {
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
  }

  function close() {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      open();
    });
  });

  closeElements.forEach(function (el) {
    el.addEventListener("click", function () {
      close();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      close();
    }
  });

  var trialForm = document.getElementById("trialForm");
  var trialNote = document.getElementById("trialNote");
  if (trialForm && trialNote) {
    trialForm.addEventListener("submit", function (event) {
      event.preventDefault();
      trialNote.textContent = "Thank you. Our team will call you to confirm your trial slot.";
    });
  }
}

function handleTestimonials() {
  var slider = document.getElementById("testimonialSlider");
  var dotsContainer = document.getElementById("testimonialDots");
  if (!slider || !dotsContainer) return;

  var slides = selectAll(".testimonial", slider);
  var dots = selectAll(".dot", dotsContainer);
  if (!slides.length) return;

  var index = 0;
  var timer = null;

  function setActive(nextIndex) {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === nextIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === nextIndex);
    });
    index = nextIndex;
  }

  function next() {
    var nextIndex = (index + 1) % slides.length;
    setActive(nextIndex);
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      setActive(dotIndex);
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(next, 7000);
    });
  });

  timer = setInterval(next, 7000);
}

function handleForms() {
  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  if (contactForm && formNote) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      formNote.textContent = "Thank you for reaching out. We will get back within one working day.";
    });
  }
}

function handleBmiPlanner() {
  var bmiForm = document.getElementById("bmiForm");
  var bmiScore = document.getElementById("bmiScore");
  var bmiCategory = document.getElementById("bmiCategory");
  var bmiTip = document.getElementById("bmiTip");
  var bmiRange = document.getElementById("bmiRange");
  var unitToggle = document.getElementById("bmiUnitToggle");
  if (!bmiForm || !bmiScore || !bmiCategory || !bmiTip || !bmiRange || !unitToggle) return;

  var unitButtons = selectAll(".bmi-unit", unitToggle);
  var panels = selectAll("[data-bmi-panel]", bmiForm);
  var activeUnit = "metric";

  function setUnit(unit) {
    activeUnit = unit;

    unitButtons.forEach(function (button) {
      var selected = button.getAttribute("data-unit") === unit;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
    });

    panels.forEach(function (panel) {
      var show = panel.getAttribute("data-bmi-panel") === unit;
      panel.classList.toggle("is-active", show);
      panel.hidden = !show;
    });
  }

  function setError(message) {
    bmiScore.textContent = "Please enter valid values";
    bmiCategory.textContent = message;
    bmiTip.textContent = "Tip: Enter realistic values and choose the correct unit.";
    bmiRange.textContent = "";
  }

  function getBmiData() {
    if (activeUnit === "metric") {
      var heightInput = document.getElementById("bmiHeight");
      var weightInput = document.getElementById("bmiWeight");
      if (!heightInput || !weightInput) return null;

      var heightCm = Number(heightInput.value);
      var weightKg = Number(weightInput.value);

      if (!heightCm || !weightKg || heightCm < 120 || heightCm > 230 || weightKg < 30 || weightKg > 250) {
        setError("For metric mode, use height 120–230 cm and weight 30–250 kg.");
        return null;
      }

      return { heightM: heightCm / 100, heightCm: heightCm, unit: "metric" };
    }

    var feetInput = document.getElementById("bmiFeet");
    var inchesInput = document.getElementById("bmiInches");
    var weightLbInput = document.getElementById("bmiWeightLb");
    if (!feetInput || !inchesInput || !weightLbInput) return null;

    var feet = Number(feetInput.value);
    var inches = Number(inchesInput.value);
    var weightLb = Number(weightLbInput.value);

    if (!feet || feet < 3 || feet > 8 || inches < 0 || inches > 11 || !weightLb || weightLb < 66 || weightLb > 550) {
      setError("For imperial mode, use 3–8 ft, 0–11 in and 66–550 lb.");
      return null;
    }

    var totalInches = feet * 12 + inches;
    var heightM = totalInches * 0.0254;
    return { heightM: heightM, heightCm: heightM * 100, unit: "imperial" };
  }

  function getCategoryInfo(bmi) {
    if (bmi < 18.5) {
      return {
        label: "Underweight range",
        focus: "Prioritize strength progression, recovery and nutrition support.",
        level: "under"
      };
    }

    if (bmi < 25) {
      return {
        label: "Normal range",
        focus: "Build consistency with 3 guided sessions per week.",
        level: "normal"
      };
    }

    if (bmi < 30) {
      return {
        label: "Overweight range",
        focus: "Start with strength + conditioning sessions and a realistic calorie plan.",
        level: "over"
      };
    }

    return {
      label: "Obesity range",
      focus: "Begin with low-impact conditioning and coached strength for safe progress.",
      level: "obese"
    };
  }

  unitButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setUnit(button.getAttribute("data-unit") || "metric");
    });
  });

  setUnit("metric");

  bmiForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = getBmiData();
    if (!data) return;

    var bmi;
    if (data.unit === "metric") {
      var kg = Number(document.getElementById("bmiWeight").value);
      bmi = kg / (data.heightM * data.heightM);
    } else {
      var lb = Number(document.getElementById("bmiWeightLb").value);
      var kgFromLb = lb * 0.45359237;
      bmi = kgFromLb / (data.heightM * data.heightM);
    }

    var bmiRounded = bmi.toFixed(1);
    var categoryInfo = getCategoryInfo(bmi);
    var minHealthyWeight = 18.5 * data.heightM * data.heightM;
    var maxHealthyWeight = 24.9 * data.heightM * data.heightM;

    bmiScore.textContent = "BMI " + bmiRounded;
    bmiCategory.textContent = categoryInfo.label + " • " + categoryInfo.focus;
    bmiTip.textContent = "Tip: BMI is one marker. We also track strength, waist and energy levels.";
    bmiRange.textContent = "Healthy weight range for your height: " + minHealthyWeight.toFixed(1) + "–" + maxHealthyWeight.toFixed(1) + " kg.";
  });
}


function handleBillingToggle() {
  var toggle = document.getElementById("billingToggle");
  if (!toggle) return;

  var options = selectAll(".billing-option", toggle);
  var cards = selectAll(".pricing-card[data-monthly][data-annual]");

  function formatPrice(value) {
    return Number(value).toLocaleString("en-IN");
  }

  function update(mode) {
    options.forEach(function (option) {
      var active = option.getAttribute("data-billing") === mode;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
    });

    cards.forEach(function (card) {
      var valueTarget = card.querySelector(".price-value");
      var periodTarget = card.querySelector(".price-period");
      if (!valueTarget || !periodTarget) return;

      var value = card.getAttribute(mode === "annual" ? "data-annual" : "data-monthly");
      valueTarget.textContent = formatPrice(value || 0);
      periodTarget.textContent = mode === "annual" ? "/month, billed yearly" : "/month";
    });
  }

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      update(option.getAttribute("data-billing") || "monthly");
    });
  });
}

function handleReveal() {
  var animatedBlocks = selectAll("[data-animate]");
  if (!animatedBlocks.length) return;

  animatedBlocks.forEach(function (el) {
    el.classList.add("fade-in-up");
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    animatedBlocks.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedBlocks.forEach(function (el) {
      el.classList.add("in-view");
    });
  }
}

function setCurrentYear() {
  var yearTarget = document.getElementById("currentYear");
  if (!yearTarget) return;
  yearTarget.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", function () {
  handleThemeToggle();
  handleNavToggle();
  handleTrialPopup();
  handleTestimonials();
  handleForms();
  handleBmiPlanner();
  handleBillingToggle();
  handleReveal();
  setCurrentYear();
  scrollToHash();
});
