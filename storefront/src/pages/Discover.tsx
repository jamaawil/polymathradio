import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllProducts, getProductsByCategory, isGhostConfigured, GhostNotConfiguredError } from "../lib/ghost";
import type { Product } from "../types/product";
import { CategoryNav } from "../components/CategoryNav";
import { ProductGrid } from "../components/ProductGrid";
import { ConfigWarning } from "../components/ConfigWarning";

const CATEGORY_LABELS: Record<string, string> = {
    reports: "Reports",
    merch: "Merch",
    certificates: "Certificates",
};

export function Discover() {
    const { category } = useParams<{ category?: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetcher = category ? getProductsByCategory(category) : getAllProducts();
        fetcher
            .then(setProducts)
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [category]);

    if (!isGhostConfigured()) {
        return (
            <div className="page-inner">
                <ConfigWarning />
            </div>
        );
    }

    const heading = category ? CATEGORY_LABELS[category] ?? category : undefined;

    return (
        <div className="page-inner">
            <header className="discover-hero">
                <p className="discover-hero__eyebrow">&#9670; Shop</p>
                <h1>Find the best of Krino Media.</h1>
                <p className="discover-hero__lede">Reports, merch, and one-time certificate access — support the work directly.</p>
            </header>

            <CategoryNav />

            {loading && <p className="discover-status">Loading products&hellip;</p>}
            {error && !(error instanceof GhostNotConfiguredError) && (
                <p className="discover-status discover-status--error">Couldn't load products: {error.message}</p>
            )}
            {!loading && !error && (
                <ProductGrid products={products} heading={heading ? `${heading}` : "All products"} />
            )}
        </div>
    );
}
