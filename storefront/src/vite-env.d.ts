/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GHOST_API_URL: string;
    readonly VITE_GHOST_CONTENT_API_KEY: string;
    readonly VITE_MAIN_SITE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
