function selectAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function handleThemeToggle() {
  var toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  var stored = window.localStorage.getItem("ironforge-theme");
  if (stored === "light") {
    document.body.classList.add("theme-light");
  }

  toggle.addEventListener("click", function () {
    document.body.classList.toggle("theme-light");
    var mode = document.body.classList.contains("theme-light") ? "light" : "dark";
    window.localStorage.setItem("ironforge-theme", mode);
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
  if (!bmiForm || !bmiScore || !bmiCategory || !bmiTip) return;

  bmiForm.addEventListener("submit", function (event) {
    event.preventDefault();

    var heightInput = document.getElementById("bmiHeight");
    var weightInput = document.getElementById("bmiWeight");
    if (!heightInput || !weightInput) return;

    var heightCm = Number(heightInput.value);
    var weightKg = Number(weightInput.value);

    if (!heightCm || !weightKg || heightCm < 120 || weightKg < 30) {
      bmiScore.textContent = "Please enter valid values";
      bmiCategory.textContent = "Height should be in cm and weight should be in kg.";
      bmiTip.textContent = "Tip: Try numbers close to your current measurements.";
      return;
    }

    var heightM = heightCm / 100;
    var bmi = weightKg / (heightM * heightM);
    var bmiRounded = bmi.toFixed(1);
    var focus = "Build consistency with 3 guided sessions per week.";
    var category = "Normal range";

    if (bmi < 18.5) {
      category = "Underweight range";
      focus = "Focus on strength progression and nutrition support for healthy weight gain.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight range";
      focus = "Start with strength + conditioning sessions and a realistic calorie plan.";
    } else if (bmi >= 30) {
      category = "Obesity range";
      focus = "Begin with low-impact conditioning and coached strength for safe progress.";
    }

    bmiScore.textContent = "BMI " + bmiRounded;
    bmiCategory.textContent = category + " • " + focus;
    bmiTip.textContent = "Tip: BMI is only one marker. Our coaches use measurements, strength and energy levels too.";
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

function handleScrollProgress() {
  var progressBar = document.getElementById("scrollProgressBar");
  if (!progressBar) return;

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;
    progressBar.style.width = Math.min(Math.max(progress, 0), 100) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

function handleBillingToggle() {
  var toggle = document.getElementById("billingToggle");
  var billingNote = document.getElementById("billingNote");
  if (!toggle) return;

  var options = selectAll(".billing-option", toggle);
  var prices = selectAll(".price[data-price-monthly][data-price-quarterly]");

  function render(mode) {
    options.forEach(function (option) {
      var isActive = option.getAttribute("data-billing") === mode;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    prices.forEach(function (el) {
      var monthly = el.getAttribute("data-price-monthly");
      var quarterly = el.getAttribute("data-price-quarterly");
      var nextPrice = mode === "quarterly" ? quarterly : monthly;
      var suffix = mode === "quarterly" ? "/month, billed quarterly" : "/month";
      el.innerHTML = "₹" + Number(nextPrice).toLocaleString("en-IN") + "<span>" + suffix + "</span>";
    });

    if (billingNote) {
      billingNote.textContent =
        mode === "quarterly"
          ? "Quarterly plans are charged every 3 months and include a 12% commitment discount."
          : "Quarterly plans are charged once every 3 months and include priority onboarding.";
    }
  }

  options.forEach(function (option) {
    option.addEventListener("click", function () {
      var mode = option.getAttribute("data-billing") || "monthly";
      render(mode);
    });
  });

  render("monthly");
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
  handleReveal();
  handleScrollProgress();
  handleBillingToggle();
  setCurrentYear();
  scrollToHash();
});
