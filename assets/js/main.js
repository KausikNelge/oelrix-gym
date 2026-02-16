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
  handleReveal();
  setCurrentYear();
  scrollToHash();
});

