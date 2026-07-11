import type { Product } from "../types/product";
import { ProductCard } from "./ProductCard";
import "./ProductGrid.css";

export function ProductGrid({ products, heading }: { products: Product[]; heading?: string }) {
    if (!products.length) {
        return <p className="product-grid__empty">Nothing here yet.</p>;
    }
    return (
        <section className="product-grid-section">
            {heading && <h2 className="product-grid-section__heading">{heading}</h2>}
            <div className="product-grid">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </section>
    );
}
