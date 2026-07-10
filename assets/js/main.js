(function () {
    "use strict";

    var root = document.documentElement;
    var THEME_KEY = "krino-theme";

    var themeToggle = document.querySelector("[data-theme-toggle]");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            var current = root.getAttribute("data-theme");
            var isDark = current === "dark" ||
                (current === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
            var next = isDark ? "light" : "dark";
            root.setAttribute("data-theme", next);
            localStorage.setItem(THEME_KEY, next);
        });
    }

    var navToggle = document.querySelector("[data-nav-toggle]");
    var nav = document.getElementById("site-nav");
    if (navToggle && nav) {
        navToggle.addEventListener("click", function () {
            var isOpen = nav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }
})();
