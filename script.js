const config = window.LA_CLASICA_CONFIG || {};
const whatsappBase = () => config.WHATSAPP_NUMBER ? `https://wa.me/${config.WHATSAPP_NUMBER}` : "#contacto";

function openWhatsApp(message) {
  if (!config.WHATSAPP_NUMBER) {
    alert("Configura WHATSAPP_NUMBER en config.js antes de publicar.");
    return;
  }
  window.open(`${whatsappBase()}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

document.querySelectorAll(".whatsapp-link").forEach(link => {
  link.href = whatsappBase();
  link.addEventListener("click", event => { event.preventDefault(); openWhatsApp(link.dataset.message || "Hola, quiero ordenar en Pizzería La Clásica."); });
});
document.querySelectorAll(".order-product").forEach(button => button.addEventListener("click", () => openWhatsApp(`Hola, quiero ordenar una ${button.dataset.product} de Pizzería La Clásica.`)));

// Menu tabs — animated
const tabButtons = document.querySelectorAll(".menu-tabs button[data-tab]");
const tabPanels  = document.querySelectorAll(".menu-layout");

function showPanel(target) {
  tabPanels.forEach(p => { p.hidden = true; p.classList.remove("tab-in"); });
  target.hidden = false;
  // Force reflow so animation restarts
  void target.offsetWidth;
  target.classList.add("tab-in");
}

// Smooth scroll helper — respects sticky header height
function smoothScrollTo(el) {
  const headerH = document.querySelector(".site-header").offsetHeight;
  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
  window.scrollTo({ top, behavior: "smooth" });
}

// Intercept all in-page anchor links for smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) { e.preventDefault(); smoothScrollTo(target); }
  });
});

tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) return;
    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.tab);
    if (!target) return;
    showPanel(target);
    smoothScrollTo(target);
  });
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
toggle.addEventListener("click", () => { const opened = toggle.getAttribute("aria-expanded") === "true"; toggle.setAttribute("aria-expanded", String(!opened)); nav.classList.toggle("is-open", !opened); document.body.classList.toggle("nav-open", !opened); });
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); document.body.classList.remove("nav-open"); }));

const header = document.querySelector(".site-header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 24), { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
document.getElementById("year").textContent = new Date().getFullYear();
