const PORTFOLIO_URL = "https://time-snowplow-615.notion.site/Portf-lio-Erick-Alves-0e87d80023174bc68a1fcdb36ba6da2e";

document.querySelectorAll(".portfolio-link").forEach(link => {
  link.href = PORTFOLIO_URL;
});

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const finePointer = window.matchMedia("(pointer:fine) and (min-width:900px)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Reveal */
const revealEls = [...document.querySelectorAll(".reveal")];
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
revealEls.forEach(el => revealObserver.observe(el));

/* Core scroll state */
const progressBar = document.querySelector(".progress span");
const heroLines = [...document.querySelectorAll(".hero-line")];
const thinking = document.querySelector(".thinking");
const words = [...document.querySelectorAll(".word")];
const header = document.querySelector(".site-header");
const aboutTitle = document.querySelector(".about-title");
const principle = document.querySelector(".principle");
const principleOutline = document.querySelector(".principle-outline");

let ticking = false;
let lastScrollY = window.scrollY;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function updateScroll() {
  const y = window.scrollY;
  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? y / maxScroll : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }

  /* Header inteligente: só no desktop, para não atrapalhar mobile */
  if (header && finePointer && y > 180) {
    const goingDown = y > lastScrollY + 4;
    const goingUp = y < lastScrollY - 4;
    if (goingDown) header.classList.add("header-hidden");
    if (goingUp) header.classList.remove("header-hidden");
  } else if (header) {
    header.classList.remove("header-hidden");
  }

  /* Hero parallax já existente, mantido */
  if (!reduceMotion) {
    heroLines.forEach((line, i) => {
      const speed = Number(line.dataset.speed || 0);
      const offset = clamp(y * speed, 0, 44);
      const x = i % 2 ? offset * .16 : -offset * .09;
      line.style.transform = `translate3d(${x}px, ${-offset}px, 0)`;
    });
  }

  /* Story de estratégia */
  if (thinking && words.length) {
    const rect = thinking.getBoundingClientRect();
    const total = thinking.offsetHeight - window.innerHeight;
    const traveled = clamp(-rect.top, 0, total);
    const local = total > 0 ? traveled / total : 0;
    const staged = clamp((local - .28) / .60, 0, .999);
    const index = Math.min(words.length - 1, Math.floor(staged * words.length));
    words.forEach((word, i) => {
      word.classList.toggle("active", i === index);
    });
  }

  /* Parallax extremamente sutil na headline "parte difícil" */
  if (aboutTitle && finePointer && !reduceMotion) {
    const rect = aboutTitle.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const delta = clamp((window.innerHeight / 2 - center) / 22, -18, 18);
    aboutTitle.style.setProperty("--about-x", `${delta * .45}px`);
    aboutTitle.style.setProperty("--about-gold-x", `${-delta * .7}px`);
  }

  /* A palavra de fundo "IDEIA" se move numa velocidade diferente */
  if (principleOutline && principle && !reduceMotion) {
    const rect = principle.getBoundingClientRect();
    const visible = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
    principleOutline.style.setProperty("--outline-x", `${(visible - .5) * 55}px`);
  }

  lastScrollY = y;
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateScroll);
    ticking = true;
  }
}, { passive:true });

updateScroll();

/* Hero spotlight segue o mouse */
const hero = document.querySelector(".hero");
if (hero && finePointer) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--mx", `${x}%`);
    hero.style.setProperty("--my", `${y}%`);
  });
}

/* Spotlight nas seções escuras */
if (finePointer) {
  document.querySelectorAll(".problems, .about, .contact").forEach(section => {
    section.addEventListener("pointermove", event => {
      const rect = section.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      section.style.setProperty("--spot-x", `${x}%`);
      section.style.setProperty("--spot-y", `${y}%`);
    });
  });
}

/* Problem rows: luz acompanha o ponteiro */
if (finePointer) {
  document.querySelectorAll(".problem-row").forEach(row => {
    row.addEventListener("pointermove", event => {
      const rect = row.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      row.style.setProperty("--row-x", `${x}%`);
      row.style.setProperty("--row-y", `${y}%`);
    });
  });
}

/* Portal: tilt com limite pequeno, sem alterar o layout */
const portal = document.querySelector(".portfolio-portal");
if (portal && finePointer && !reduceMotion) {
  portal.addEventListener("pointermove", event => {
    const rect = portal.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    const ry = clamp((nx - .5) * 4.2, -2.1, 2.1);
    const rx = clamp((.5 - ny) * 3.2, -1.6, 1.6);

    portal.style.setProperty("--portal-x", `${nx * 100}%`);
    portal.style.setProperty("--portal-y", `${ny * 100}%`);
    portal.style.setProperty("--portal-rx", `${rx}deg`);
    portal.style.setProperty("--portal-ry", `${ry}deg`);
  });

  portal.addEventListener("pointerleave", () => {
    portal.style.setProperty("--portal-rx", "0deg");
    portal.style.setProperty("--portal-ry", "0deg");
    portal.style.setProperty("--portal-x", "50%");
    portal.style.setProperty("--portal-y", "50%");
  });
}

/* Magnetic — apenas botões pequenos; portal usa tilt próprio */
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      element.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

/* Cursor contextual */
const cursor = document.querySelector(".cursor");
if (cursor && finePointer) {
  let cx = 0, cy = 0, tx = 0, ty = 0;

  function animateCursor() {
    cx += (tx - cx) * .24;
    cy += (ty - cy) * .24;
    cursor.style.left = `${cx}px`;
    cursor.style.top = `${cy}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  window.addEventListener("pointermove", event => {
    tx = event.clientX;
    ty = event.clientY;
  }, { passive:true });

  document.querySelectorAll("a").forEach(link => {
    link.addEventListener("pointerenter", () => cursor.classList.add("is-link"));
    link.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-link", "is-action");
      cursor.removeAttribute("data-label");
    });
  });

  const setActionCursor = (element, label) => {
    element.addEventListener("pointerenter", () => {
      cursor.dataset.label = label;
      cursor.classList.add("is-action");
    });
    element.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-action");
      cursor.removeAttribute("data-label");
    });
  };

  if (portal) setActionCursor(portal, "ABRIR ↗");

  const contactButton = document.querySelector(".contact-button");
  if (contactButton) setActionCursor(contactButton, "OLÁ ↗");
}

/* Princípio entra como um momento, não como bloco genérico */
if (principle) {
  const principleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      principle.classList.toggle("is-inview", entry.isIntersecting);
    });
  }, { threshold:.22 });
  principleObserver.observe(principle);
}

/* Navegação mostra em que parte do site estamos */
const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
const navTargets = navLinks
  .map(link => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

if (navTargets.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove("is-active"));
      const match = navTargets.find(item => item.target === entry.target);
      if (match) match.link.classList.add("is-active");
    });
  }, {
    threshold:.3,
    rootMargin:"-25% 0px -45% 0px"
  });

  navTargets.forEach(item => navObserver.observe(item.target));
}
