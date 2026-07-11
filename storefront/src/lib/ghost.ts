import type { GhostPost, Product } from "../types/product";
import { toProduct } from "../types/product";

const GHOST_URL = import.meta.env.VITE_GHOST_API_URL as string | undefined;
const GHOST_KEY = import.meta.env.VITE_GHOST_CONTENT_API_KEY as string | undefined;

export class GhostNotConfiguredError extends Error {
    constructor() {
        super(
            "VITE_GHOST_API_URL / VITE_GHOST_CONTENT_API_KEY are not set. " +
                "Copy .env.example to .env.local and fill in real values from " +
                "the Ghost Admin (Settings -> Integrations -> Ghost Core Content API)."
        );
        this.name = "GhostNotConfiguredError";
    }
}

async function fetchPosts(filter: string): Promise<GhostPost[]> {
    if (!GHOST_URL || !GHOST_KEY) {
        throw new GhostNotConfiguredError();
    }
    const url = `${GHOST_URL.replace(/\/$/, "")}/ghost/api/content/posts/?key=${GHOST_KEY}&filter=${encodeURIComponent(
        filter
    )}&include=tags&limit=100&fields=id,slug,title,custom_excerpt,feature_image,feature_image_alt,html,url,tags`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Ghost Content API request failed: ${res.status}`);
    }
    const data = await res.json();
    return data.posts as GhostPost[];
}

export async function getAllProducts(): Promise<Product[]> {
    const posts = await fetchPosts("primary_tag:shop");
    return posts.map(toProduct);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const posts = await fetchPosts(`primary_tag:shop+tag:${categorySlug}`);
    return posts.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const posts = await fetchPosts(`primary_tag:shop+slug:${slug}`);
    return posts.length ? toProduct(posts[0]) : null;
}

export function isGhostConfigured(): boolean {
    return Boolean(GHOST_URL && GHOST_KEY);
}
