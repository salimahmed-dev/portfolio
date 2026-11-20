// ===== 1. Light / dark theme toggle =====
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
  // Work out the theme currently on screen (saved choice or system setting)
  const current =
    root.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "light" ? "dark" : "light";

  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {} // remember it
});

// ===== 2. Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", false);
  });
});

// ===== 3. Scroll reveal + skill numbers counting up =====
function countUp(el) {
  const target = Number(el.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * progress);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      revealObserver.unobserve(entry.target); // only animate once
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ===== 4. Highlight the nav link for the section on screen =====
const sections = document.querySelectorAll("main section[id]");
const linkFor = {};
navLinks.querySelectorAll("a").forEach((a) => (linkFor[a.getAttribute("href").slice(1)] = a));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = linkFor[entry.target.id];
      if (link) link.classList.toggle("active", entry.isIntersecting);
    });
  },
  { rootMargin: "-45% 0px -50% 0px" } // "on screen" = crossing the middle
);
sections.forEach((s) => navObserver.observe(s));

// ===== 5. Live clock for Addis Ababa =====
const clock = document.getElementById("clock");
const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Addis_Ababa",
});

function updateClock() {
  clock.textContent = timeFormat.format(new Date());
}
updateClock();
setInterval(updateClock, 10000);

// ===== 6. Card spotlight: a soft glow follows the mouse =====
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - box.left}px`);
    card.style.setProperty("--my", `${e.clientY - box.top}px`);
  });
});

// ===== 7. Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
