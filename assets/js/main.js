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

    // YouTube click-to-load facade: Ghost's native embed card renders a
    // real <iframe src="youtube.com/embed/..."> immediately, which pulls
    // in YouTube's full player JS on every Watch post whether or not
    // anyone plays it. Swap it for a thumbnail + play button on load, and
    // only insert the real iframe (with autoplay) on click.
    (function youtubeFacades() {
        var iframes = document.querySelectorAll(
            '.kg-embed-card iframe[src*="youtube.com/embed/"], .kg-embed-card iframe[src*="youtube-nocookie.com/embed/"]'
        );
        iframes.forEach(function (iframe) {
            var match = iframe.src.match(/embed\/([A-Za-z0-9_-]+)/);
            if (!match) {
                return;
            }
            var videoId = match[1];
            var card = iframe.closest(".kg-embed-card");
            var title = iframe.title || "Play video";

            var facade = document.createElement("button");
            facade.type = "button";
            facade.className = "yt-facade";
            facade.setAttribute("aria-label", title);
            facade.style.backgroundImage =
                'url("https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg")';
            facade.innerHTML = '<span class="yt-facade__play" aria-hidden="true"></span>';

            var originalSrc = iframe.src;
            facade.addEventListener("click", function () {
                var player = document.createElement("iframe");
                player.src = originalSrc + (originalSrc.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
                player.title = title;
                player.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
                player.setAttribute("allowfullscreen", "");
                player.frameBorder = "0";
                card.replaceChild(player, facade);
            }, { once: true });

            card.replaceChild(facade, iframe);
        });
    })();

    // Reading progress bar — fills as the reader scrolls through
    // .post__content on long-form Read posts.
    (function readingProgress() {
        var content = document.querySelector(".post__content");
        var bar = document.querySelector("[data-reading-progress]");
        if (!content || !bar) {
            return;
        }
        var update = function () {
            var rect = content.getBoundingClientRect();
            var total = rect.height - window.innerHeight;
            var scrolled = -rect.top;
            var pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
            bar.style.width = pct + "%";
        };
        document.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    })();

    // Table of contents — builds from h2/h3 headings inside long-form
    // content and highlights the section currently in view.
    (function tableOfContents() {
        var content = document.querySelector(".post__content");
        var tocList = document.querySelector("[data-toc-list]");
        var tocWrapper = document.querySelector("[data-toc]");
        if (!content || !tocList || !tocWrapper) {
            return;
        }
        var headings = content.querySelectorAll("h2, h3");
        if (headings.length < 3) {
            return;
        }
        var links = [];
        headings.forEach(function (heading, index) {
            if (!heading.id) {
                heading.id = "section-" + (index + 1);
            }
            var li = document.createElement("li");
            li.className = "post-toc__item post-toc__item--" + heading.tagName.toLowerCase();
            var a = document.createElement("a");
            a.href = "#" + heading.id;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
            links.push({ link: a, heading: heading });
        });
        tocWrapper.hidden = false;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }
                    links.forEach(function (item) {
                        item.link.classList.toggle("is-active", item.heading === entry.target);
                    });
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        headings.forEach(function (heading) {
            observer.observe(heading);
        });
    })();

    // Sticky mini-player — mirrors a native Koenig Audio card's <audio>
    // element in a fixed bottom bar while it plays. Page-scoped: this
    // does not survive a full page navigation (see the comment in
    // default.hbs for why that's a bigger architectural change).
    (function stickyPlayer() {
        var bar = document.querySelector("[data-sticky-player]");
        var audioEls = document.querySelectorAll(".kg-audio-card audio");
        if (!bar || !audioEls.length) {
            return;
        }
        var titleEl = bar.querySelector("[data-sticky-player-title]");
        var toggleEl = bar.querySelector("[data-sticky-player-toggle]");
        var closeEl = bar.querySelector("[data-sticky-player-close]");
        var pageTitleEl = document.querySelector(".post__title");
        var title = pageTitleEl ? pageTitleEl.textContent : document.title;
        var activeAudio = null;

        audioEls.forEach(function (audio) {
            audio.addEventListener("play", function () {
                activeAudio = audio;
                titleEl.textContent = title;
                toggleEl.textContent = "Pause";
                bar.hidden = false;
            });
            audio.addEventListener("pause", function () {
                if (activeAudio === audio) {
                    toggleEl.textContent = "Play";
                }
            });
            audio.addEventListener("ended", function () {
                if (activeAudio === audio) {
                    bar.hidden = true;
                }
            });
        });

        toggleEl.addEventListener("click", function () {
            if (!activeAudio) {
                return;
            }
            if (activeAudio.paused) {
                activeAudio.play();
            } else {
                activeAudio.pause();
            }
        });

        closeEl.addEventListener("click", function () {
            if (activeAudio) {
                activeAudio.pause();
            }
            bar.hidden = true;
        });
    })();

    // Course lesson completion — client-side only (localStorage), keyed
    // per lesson slug. No server-side per-member progress store exists
    // natively in Ghost; this is intentionally lightweight per the brief.
    (function lessonProgress() {
        var STORAGE_KEY = "krino-lessons-complete";
        var button = document.querySelector("[data-lesson-complete]");
        if (!button) {
            return;
        }
        var slug = button.getAttribute("data-lesson-complete");
        var getCompleted = function () {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            } catch (e) {
                return [];
            }
        };
        var setState = function () {
            var done = getCompleted().indexOf(slug) > -1;
            button.classList.toggle("is-complete", done);
            button.textContent = done ? "Completed ✓" : "Mark as complete";
        };
        button.addEventListener("click", function () {
            var completed = getCompleted();
            var i = completed.indexOf(slug);
            if (i > -1) {
                completed.splice(i, 1);
            } else {
                completed.push(slug);
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
            setState();
        });
        setState();

        // Also paint completion checkmarks on any curriculum list present
        // on the same page (course landing pages).
        var completedSlugs = getCompleted();
        document.querySelectorAll("[data-lesson-slug]").forEach(function (el) {
            if (completedSlugs.indexOf(el.getAttribute("data-lesson-slug")) > -1) {
                el.classList.add("is-complete");
            }
        });
    })();

    // Portal scroll-depth signup prompt — nudges anonymous, non-member
    // readers once per session after they've read ~60% of a page.
    (function scrollDepthPortal() {
        if (document.body.classList.contains("member-logged-in")) {
            return;
        }
        var SESSION_KEY = "krino-scroll-portal-shown";
        if (sessionStorage.getItem(SESSION_KEY)) {
            return;
        }
        var triggered = false;
        var check = function () {
            if (triggered) {
                return;
            }
            var scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable <= 0) {
                return;
            }
            var pct = (window.scrollY / scrollable) * 100;
            if (pct >= 60) {
                triggered = true;
                sessionStorage.setItem(SESSION_KEY, "1");
                var trigger = document.querySelector('[data-portal="signup"]');
                if (trigger && window.location.hash.indexOf("portal") === -1) {
                    window.location.hash = "#/portal/signup";
                }
            }
        };
        document.addEventListener("scroll", check, { passive: true });
    })();
})();
