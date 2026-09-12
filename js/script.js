(() => {
  "use strict";

  const DESKTOP_QUERY = "(min-width: 1024px)";

  const initNavigation = () => {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primary-navigation");

    if (!toggle || !nav) return;

    const isOpen = () => nav.classList.contains("is-open");

    const openMenu = () => {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Menüyü kapat");
      document.body.classList.add("nav-open");
    };

    const closeMenu = ({ returnFocus = false } = {}) => {
      if (!isOpen()) return;

      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Menüyü aç");
      document.body.classList.remove("nav-open");

      if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => {
      if (isOpen()) {
        closeMenu();
        return;
      }

      openMenu();
    });

    nav.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a");

      if (!link) return;

      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isOpen()) return;

      closeMenu({ returnFocus: true });
    });

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);

    const handleViewportChange = (event) => {
      if (event.matches) {
        closeMenu();
      }
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleViewportChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleViewportChange);
    }
  };

  const initMenuFilter = () => {
    const filterGroup = document.querySelector(".menu-filter");
    const grid = document.getElementById("menu-preview-grid");

    if (!filterGroup || !grid) return;

    const buttons = Array.from(
      filterGroup.querySelectorAll(".menu-filter__button")
    );

    const items = Array.from(
      grid.querySelectorAll(".menu-item")
    );

    if (!buttons.length || !items.length) return;

    filterGroup.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;

      const button = event.target.closest(".menu-filter__button");

      if (!button || !filterGroup.contains(button)) return;

      const category = button.dataset.filter;

      if (!category) return;

      buttons.forEach((btn) => {
        const active = btn === button;

        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", String(active));
      });

      items.forEach((item) => {
        const itemCategory = item.dataset.category;
        const show =
          category === "tumu" ||
          itemCategory === category;

        item.classList.toggle("is-hidden", !show);
      });
    });
  };

  const initHeaderScroll = () => {
    const header = document.querySelector(".site-header");

    if (!header) return;

    const threshold = 12;
    let ticking = false;

    const update = () => {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > threshold
      );

      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    update();
  };

  const init = () => {
    initNavigation();
    initMenuFilter();
    initHeaderScroll();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true
    });
  } else {
    init();
  }
})();