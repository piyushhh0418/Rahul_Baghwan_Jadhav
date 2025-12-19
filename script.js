(() => {

  /* =========================
     FADE-IN ON SCROLL
  ========================= */
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  function observeFadeElements(root = document) {
    root.querySelectorAll(".fade-in").forEach(el => {
      fadeObserver.observe(el);
    });
  }

  observeFadeElements();


  /* =========================
     BUTTON CLICK EFFECT
  ========================= */
  document.addEventListener("click", e => {
    const btn = e.target.closest(".view-btn");
    if (!btn) return;

    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 150);
  });


  /* =========================
     IMPACT COUNTERS
  ========================= */
  function initCounters(root = document) {
    root.querySelectorAll(".impact h3").forEach(counter => {
      if (counter.dataset.done) return;
      counter.dataset.done = "true";

      const target = parseInt(counter.innerText, 10);
      counter.innerText = "0";

      let count = 0;
      const step = Math.ceil(target / 80);

      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.innerText = target + "+";
          clearInterval(interval);
        } else {
          counter.innerText = count;
        }
      }, 20);
    });
  }

  initCounters();


  /* =========================
     INFINITE WORK FEED
     (Matches work.css)
  ========================= */

  const pages = [
    "work-health.html",
    "work-admin.html"
  ];

  let pageIndex = 0;
  let loading = false;

  const loader = document.getElementById("loader");
  const feed = document.getElementById("feed");

  if (!loader || !feed) {
    console.warn("Feed or loader not found — infinite scroll disabled");
    return;
  }

  async function loadNextPage() {
    if (loading || pageIndex >= pages.length) return;
    loading = true;

    try {
      const response = await fetch(pages[pageIndex]);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      /* 🔥 IMPORTANT: use work-gallery-section */
      const section = doc.querySelector(".work-gallery-section");

      if (section) {
        feed.appendChild(section);

        /* Re-init animations if needed later */
        observeFadeElements(section);
        initCounters(section);
      } else {
        console.error("No .work-gallery-section found in", pages[pageIndex]);
      }

      pageIndex++;

      if (pageIndex >= pages.length) {
        loader.style.display = "none";
      }

    } catch (error) {
      console.error("Error loading page:", error);
    }

    loading = false;
  }

  const feedObserver = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        loadNextPage();
      }
    },
    { rootMargin: "300px" }
  );

  feedObserver.observe(loader);

})();

/* =========================
   HAMBURGER MENU LOGIC
========================= */

const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");

if (hamburger && sideMenu && menuOverlay) {

  function closeMenu() {
    hamburger.classList.remove("active");
    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("show");
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    sideMenu.classList.toggle("open");
    menuOverlay.classList.toggle("show");
  });

  menuOverlay.addEventListener("click", closeMenu);

  // Close menu when link clicked
  sideMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}
