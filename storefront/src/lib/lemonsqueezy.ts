// Loads Lemon Squeezy's overlay checkout script exactly once, no matter
// how many times a page with "Buy" buttons mounts. Any <a class="lemonsqueezy-button">
// on the page opens an on-page iframe checkout when clicked — that's the
// entire integration, Lemon Squeezy's own JS does the rest.
let loaded = false;

export function ensureLemonSqueezyLoaded(): void {
    if (loaded || typeof document === "undefined") {
        return;
    }
    if (document.querySelector('script[src*="lemon.js"]')) {
        loaded = true;
        return;
    }
    const script = document.createElement("script");
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.defer = true;
    script.onload = () => {
        const w = window as unknown as { createLemonSqueezy?: () => void };
        w.createLemonSqueezy?.();
    };
    document.body.appendChild(script);
    loaded = true;
}
