function toggleNav() {
    const menuBtn = document.querySelector(".hamburger-menu");
    const menuIcon = document.querySelector(".menu-icon");
    const menuItems = document.querySelector("#menu-items");
    const navbar = document.querySelector("#navbar");
    const htmlElement = document.documentElement; 
    const body = document.body;
  
    if (!menuBtn || !menuIcon || !menuItems) return;
  
    menuBtn.addEventListener("click", () => {
      const menuExpanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuIcon.classList.toggle("is-active");
      menuBtn.setAttribute("aria-expanded", menuExpanded ? "false" : "true");
      menuBtn.setAttribute(
        "aria-label",
        menuExpanded ? "Open Menu" : "Close Menu"
      );
      if (!menuExpanded) {
        navbar.classList.add("nav-overlay","overscroll-contain");
        body.classList.add('overflow-hidden');
        htmlElement.classList.add('overflow-hidden');
      }
      else {
        navbar.classList.remove("nav-overlay","overscroll-contain");
        body.classList.remove('overflow-hidden');
        htmlElement.classList.remove('overflow-hidden');
      }
      menuItems.classList.toggle("display-none");
    });
  }
  
  function initScrollBehavior() {
    const navbar = document.getElementById("navbar");
    const scrollBottom = document.getElementById("scroll-bottom");
  
    if (!navbar || !scrollBottom) return;
  
    let lastScrollY = window.scrollY;
    let isSticky = false;
    let ticking = false;

    updateNavbar();
  
    function updateNavbar() {
      const currentScroll = window.scrollY;
      const scrollDown = currentScroll > lastScrollY;
      const scrollUp = currentScroll < lastScrollY-2;
      const rect = scrollBottom.getBoundingClientRect();
      const navdim = navbar.getBoundingClientRect();
  
      if (scrollUp && rect.bottom < 0) {
        navbar.classList.add("sticky-visible");
        navbar.classList.remove("sticky-hidden","sticky-glitch");
        isSticky = true;
      } else if (scrollDown && rect.bottom < 0 && isSticky) {
        navbar.classList.add("sticky-hidden");
        navbar.classList.remove("sticky-visible","sticky-glitch");
      } 
      else if (rect.bottom < 0 && !isSticky) {
        navbar.classList.add("sticky-hidden");
        navbar.classList.add("sticky-glitch");
      } 
      if (rect.bottom > navdim.height) {
        navbar.classList.remove("sticky-visible", "sticky-hidden","sticky-glitch");
        isSticky = false;
      }
  
      lastScrollY = currentScroll;
      ticking = false;
    }
  
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }
  
  function initNavbar() {
    toggleNav();
    initScrollBehavior();
  }
  
  document.addEventListener("astro:after-swap", initNavbar);
  document.addEventListener("DOMContentLoaded", initNavbar);
  