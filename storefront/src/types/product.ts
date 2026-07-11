// Shape of the fields we actually use from a Ghost Content API post.
// Products live in Ghost itself (primary_tag: shop) — this storefront
// doesn't have its own product database, it reads the same posts the
// Ghost theme's /shop/ pages show, so there's one source of truth.
export interface GhostPost {
    id: string;
    slug: string;
    title: string;
    custom_excerpt: string | null;
    feature_image: string | null;
    feature_image_alt: string | null;
    html: string;
    url: string;
    tags: { name: string; slug: string }[];
    primary_tag: { name: string; slug: string } | null;
}

export interface Product {
    id: string;
    slug: string;
    title: string;
    priceLabel: string | null;
    image: string | null;
    imageAlt: string;
    category: string | null;
    ghostUrl: string;
    description: string;
    checkoutUrl: string | null;
}

const CATEGORY_SLUGS = ["reports", "merch", "certificates"];

// Pull the first real checkout link out of a product post's body. Editors
// add this as a native Ghost Button card pointing at their actual Stripe
// Payment Link / Lemon Squeezy / Gumroad URL (see the Ghost theme's
// README for why there's no structured "checkout URL" field to read
// instead — Ghost doesn't have one, so this is the honest way to source
// it without guessing).
function extractCheckoutUrl(html: string): string | null {
    const match = html.match(/class="kg-btn[^"]*"\s+href="([^"]+)"/);
    if (match) {
        return match[1];
    }
    // Fallback: any link whose text mentions buying/checkout.
    const fallback = html.match(/<a[^>]+href="([^"]+)"[^>]*>[^<]*(?:buy|checkout|purchase)[^<]*<\/a>/i);
    return fallback ? fallback[1] : null;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function toProduct(post: GhostPost): Product {
    const category = post.tags.find((t) => CATEGORY_SLUGS.includes(t.slug))?.name ?? null;
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        priceLabel: post.custom_excerpt,
        image: post.feature_image,
        imageAlt: post.feature_image_alt || post.title,
        category,
        ghostUrl: post.url,
        description: stripHtml(post.html).slice(0, 220),
        checkoutUrl: extractCheckoutUrl(post.html),
    };
}
