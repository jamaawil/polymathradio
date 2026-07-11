import "./ConfigWarning.css";

// Shown instead of a broken/empty product grid when the Content API
// credentials aren't set — an honest "not configured yet" state rather
// than silently failing or showing fake data.
export function ConfigWarning() {
    return (
        <div className="config-warning">
            <h1>Not connected to Krino Media yet</h1>
            <p>
                This storefront reads its product catalog live from the same Ghost site (Watch/Listen/Read/Learn) —
                there's no separate product database to keep in sync.
            </p>
            <p>To connect it:</p>
            <ol>
                <li>
                    In Ghost Admin, go to <strong>Settings &rarr; Integrations</strong> and open (or create) a Content API
                    integration.
                </li>
                <li>Copy its Content API key.</li>
                <li>
                    Copy <code>.env.example</code> to <code>.env.local</code> in this repo and fill in{" "}
                    <code>VITE_GHOST_API_URL</code> and <code>VITE_GHOST_CONTENT_API_KEY</code>.
                </li>
                <li>Restart the dev server (or redeploy, if this is already live).</li>
            </ol>
        </div>
    );
}
