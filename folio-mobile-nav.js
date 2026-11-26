/* folio Official — mobile navigation controller
   Isolated controller loaded after the site's legacy scripts.
   Uses document capture so older target-level handlers cannot swallow taps. */
(() => {
  "use strict";
  const init = () => {
    const header = document.querySelector(".topbar");
    const nav = header?.querySelector("nav");
    const button = header?.querySelector("button.menu");
    if (!header || !nav || !button) return;

    const mobile = window.matchMedia("(max-width: 1100px)");
    nav.id = nav.id || "folio-main-nav";
    button.type = "button";
    button.setAttribute("aria-controls", nav.id);
    button.setAttribute("aria-haspopup", "true");
    button.setAttribute("aria-label", "メニューを開く");
    let opened = false;

    const updatePosition = () => {
      if (!opened || !mobile.matches) return;
      const rect = header.getBoundingClientRect();
      nav.style.setProperty("--folio-nav-top", Math.max(8, rect.bottom + 8) + "px");
    };
    const setOpen = (next, returnFocus = false) => {
      opened = Boolean(next && mobile.matches);
      nav.classList.toggle("folio-mobile-nav-open", opened);
      nav.classList.toggle("folio-mobile-nav", mobile.matches);
      button.classList.toggle("folio-menu-open", opened);
      button.setAttribute("aria-expanded", String(opened));
      button.setAttribute("aria-label", opened ? "メニューを閉じる" : "メニューを開く");
      nav.setAttribute("aria-hidden", String(mobile.matches && !opened));
      nav.inert = mobile.matches && !opened;
      if (opened) updatePosition();
      else nav.style.removeProperty("--folio-nav-top");
      if (returnFocus) button.focus();
    };

    const style = document.createElement("style");
    style.dataset.folioMobileNav = "true";
    style.textContent = `
      @media (max-width:1100px) {
        .topbar nav.folio-mobile-nav {
          display:none !important;
          position:fixed !important;
          top:var(--folio-nav-top,80px) !important;
          left:12px !important;
          right:12px !important;
          width:auto !important;
          max-width:none !important;
          max-height:calc(100dvh - var(--folio-nav-top,80px) - 16px) !important;
          overflow-y:auto !important;
          overscroll-behavior:contain;
          -webkit-overflow-scrolling:touch;
          z-index:2147483000 !important;
          grid-template-columns:repeat(2,minmax(0,1fr)) !important;
          align-items:stretch !important;
          gap:7px !important;
          padding:12px !important;
          margin:0 !important;
          border:1px solid var(--line,#dfe3d7) !important;
          border-radius:16px !important;
          background:var(--surface,#fff) !important;
          box-shadow:0 18px 50px rgba(20,24,16,.20) !important;
          visibility:hidden !important;
          opacity:0 !important;
          pointer-events:none !important;
        }
        .topbar nav.folio-mobile-nav.folio-mobile-nav-open {
          display:grid !important;
          visibility:visible !important;
          opacity:1 !important;
          pointer-events:auto !important;
        }
        .topbar nav.folio-mobile-nav a {
          display:flex !important;
          align-items:center !important;
          justify-content:space-between !important;
          min-width:0 !important;
          min-height:48px !important;
          padding:12px 10px !important;
          border:1px solid var(--line,#dfe3d7) !important;
          border-radius:10px !important;
          text-align:left !important;
          white-space:normal !important;
          overflow-wrap:anywhere !important;
          font-size:11px !important;
          line-height:1.4 !important;
          background:transparent !important;
        }
        .topbar button.menu.folio-menu-open {
          background:var(--ink,#20251d) !important;
          color:var(--bg,#fff) !important;
          border-color:var(--ink,#20251d) !important;
        }
      }
      @media (min-width:1101px) {
        .topbar nav.folio-mobile-nav { display:flex !important; }
      }
    `;
    document.head.appendChild(style);
    setOpen(false);

    document.addEventListener("click", event => {
      const target = event.target;
      const trigger = target instanceof Element ? target.closest(".topbar button.menu") : null;
      if (trigger === button) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (mobile.matches) setOpen(!opened);
        return;
      }
      if (opened && !header.contains(target)) setOpen(false);
      if (opened && target instanceof Element && target.closest(".topbar nav a[href]")) setOpen(false);
    }, true);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && opened) setOpen(false, true);
    });
    const onLayoutChange = () => setOpen(false);
    if (mobile.addEventListener) mobile.addEventListener("change", onLayoutChange);
    else mobile.addListener(onLayoutChange);
    window.addEventListener("resize", updatePosition, { passive:true });
    window.addEventListener("scroll", updatePosition, { passive:true, capture:true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
