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


const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const backdrop = document.getElementById("navBackdrop");
const setNav = open => {
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
  document.documentElement.classList.toggle("nav-open", open);
};
toggle.addEventListener("click", () => setNav(toggle.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setNav(false)));
if (backdrop) backdrop.addEventListener("click", () => setNav(false));
document.addEventListener("keydown", event => { if (event.key === "Escape" && nav.classList.contains("is-open")) setNav(false); });

const header = document.querySelector(".site-header");
addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 24), { passive: true });
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }}), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
document.getElementById("year").textContent = new Date().getFullYear();

// Interactive historical galleries
const historyGalleries = {
  horno: {
    title: "2014 · Un horno en casa",
    description: "El origen de La Clásica: un jardín, un horno de leña y el deseo de cocinar para familia y amigos.",
    items: [
      ["assets/historia/un-horno-en-casa-principal.webp", "Juan preparando pizza frente al horno en casa."],
      ["assets/historia/horno-en-casa-jardin.webp", "Juan junto al horno de leña en el jardín."],
      ["assets/historia/horno-el-rincon-de-juan.webp", "El Rincón de Juan, parte de los primeros recuerdos de la historia."],
      ["assets/historia/horno-artesanal-01.webp", "Primer horno artesanal."],
      ["assets/historia/horno-artesanal-02.webp", "El horno encendido durante los primeros años."],
      ["assets/historia/horno-fuego-pizza.webp", "Pizza al fuego: el punto de partida de La Clásica."]
    ]
  },
  pedidos: {
    title: "Primeros pedidos",
    description: "La pizza empieza a viajar: las primeras entregas, el equipo y una operación que comenzaba a crecer.",
    items: [
      ["assets/historia/primeros-pedidos-motos.webp", "Primeros pedidos y entregas en motocicleta."],
      ["assets/historia/primeros-pedidos-cajas.webp", "Los primeros pedidos listos para salir."],
      ["assets/historia/primeros-pedidos-flota.webp", "El crecimiento de la flota de reparto."],
      ["assets/historia/primeros-pedidos-operacion.webp", "El equipo preparando y coordinando pedidos."],
      ["assets/historia/primeros-envios-lluvia.webp", "Nuestros primeros envíos, incluso bajo la lluvia."]
    ]
  },
  expansion: {
    title: "Expansión",
    description: "Nuevos locales, más mesas y una comunidad que creció alrededor de La Clásica.",
    items: [
      ["assets/historia/expansion-santa-tecla-delivery.webp", "La Clásica Santa Tecla, etapa de expansión del servicio a domicilio."],
      ["assets/historia/primer-local-domicilio-2015.webp", "Escalón - El Salvador"],
      ["assets/historia/expansion-operacion-01.webp", "Centro Histórico - El Salvador"],
      ["assets/historia/expansion-operacion-02.webp", "Santa Tecla - El Salvador"],
      ["assets/historia/escalon-2017-primera-mesa.webp", "Sucursal Escalón · 2017 · nuestra primera mesa."]
    ]
  },
  reconocimientos: {
    title: "Reconocimientos",
    description: "Una evolución sostenida en 50 Top Pizza y el reconocimiento internacional al trabajo de Juan Cárcamo.",
    items: [
      ["assets/reconocimientos/50-top-2024-39.webp", "50 Top Pizza Latin America 2024 · 39.º lugar · Top Pizzería en El Salvador."],
      ["assets/reconocimientos/50-top-2025-9.webp", "50 Top Pizza Latin America 2025 · 9.º lugar · Top Pizzería en El Salvador."],
      ["assets/reconocimientos/50-top-2026-5.webp", "50 Top Pizza Latin America 2026 · 5.º lugar · Top Pizzería en El Salvador."],
      ["assets/reconocimientos/pizza-maker-2026.webp", "Juan Cárcamo · Pizza Maker of the Year 2026 · Ferrarelle Award."],
      ["assets/reconocimientos/tbc2026milan.webp", "The Best Chef Pizza 2026 · Milán · Juan Cárcamo."],
      ["assets/reconocimientos/100 juan_carcamo.webp", "The Best Chef Pizza 100 · Juan Cárcamo."]
    ]
  }
};

const historyModal = document.getElementById("history-modal");
if (historyModal) {
  const galleryTitle = document.getElementById("gallery-title");
  const galleryDescription = document.getElementById("gallery-description");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryCounter = document.getElementById("gallery-counter");
  const galleryThumbs = document.getElementById("gallery-thumbs");
  let activeGallery = null;
  let activeIndex = 0;
  let lastTrigger = null;

  function renderGalleryItem() {
    if (!activeGallery) return;
    const data = historyGalleries[activeGallery];
    const [src, caption] = data.items[activeIndex];
    galleryImage.classList.add("is-changing");
    galleryCaption.style.opacity = "0";
    setTimeout(() => {
      galleryImage.src = src;
      galleryImage.alt = caption;
      galleryCaption.textContent = caption;
      galleryCounter.textContent = `${activeIndex + 1} / ${data.items.length}`;
      [...galleryThumbs.children].forEach((button, i) => button.classList.toggle("active", i === activeIndex));
      requestAnimationFrame(() => {
        galleryImage.classList.remove("is-changing");
        galleryCaption.style.opacity = "1";
      });
    }, 150);
  }

  function openGallery(name, startIndex = 0, trigger = null) {
    const data = historyGalleries[name];
    if (!data) return;
    activeGallery = name;
    activeIndex = Math.max(0, Math.min(Number(startIndex) || 0, data.items.length - 1));
    lastTrigger = trigger;
    galleryTitle.textContent = data.title;
    galleryDescription.textContent = data.description;
    galleryThumbs.innerHTML = "";
    data.items.forEach(([src, caption], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", `Ver imagen ${index + 1}: ${caption}`);
      const image = document.createElement("img");
      image.src = src;
      image.alt = "";
      button.appendChild(image);
      button.addEventListener("click", () => { activeIndex = index; renderGalleryItem(); });
      galleryThumbs.appendChild(button);
    });
    renderGalleryItem();
    historyModal.classList.add("is-open");
    historyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gallery-open");
    historyModal.querySelector(".history-modal-close").focus();
  }

  function closeGallery() {
    historyModal.classList.remove("is-open");
    historyModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("gallery-open");
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-gallery]").forEach(trigger => trigger.addEventListener("click", () => openGallery(trigger.dataset.gallery, trigger.dataset.index, trigger)));
  historyModal.querySelectorAll("[data-close-gallery]").forEach(el => el.addEventListener("click", closeGallery));
  historyModal.querySelector(".gallery-prev").addEventListener("click", () => { const n = historyGalleries[activeGallery].items.length; activeIndex = (activeIndex - 1 + n) % n; renderGalleryItem(); });
  historyModal.querySelector(".gallery-next").addEventListener("click", () => { const n = historyGalleries[activeGallery].items.length; activeIndex = (activeIndex + 1) % n; renderGalleryItem(); });
  document.addEventListener("keydown", event => {
    if (!historyModal.classList.contains("is-open")) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") historyModal.querySelector(".gallery-prev").click();
    if (event.key === "ArrowRight") historyModal.querySelector(".gallery-next").click();
  });
}

(function initFormacion() {
  const toggle = document.getElementById("formacionToggle");
  const panel = document.getElementById("formacionPanel");
  if (!toggle || !panel) return;
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  panel.querySelectorAll(".formacion-row").forEach(row => {
    row.addEventListener("click", () => {
      const detail = row.nextElementSibling;
      const open = detail.classList.toggle("open");
      row.setAttribute("aria-expanded", open);
    });
  });
})();

(function initCertModal() {
  const modal = document.getElementById("certModal");
  const image = document.getElementById("certImage");
  const title = document.getElementById("certTitle");
  const closeBtn = modal?.querySelector(".cert-modal-close");
  if (!modal || !image || !title || !closeBtn) return;

  let lastTrigger = null;

  const open = (src, name, trigger) => {
    lastTrigger = trigger;
    image.src = src;
    image.alt = name;
    title.textContent = name;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cert-open");
    closeBtn.focus();
  };
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cert-open");
    if (lastTrigger) lastTrigger.focus();
  };

  document.querySelectorAll("[data-cert]").forEach(btn => {
    btn.addEventListener("click", () => open(btn.dataset.cert, btn.dataset.name, btn));
  });
  modal.querySelectorAll("[data-close-cert]").forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", event => {
    if (!modal.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
  });
})();
