import { Link } from "react-router-dom";
import type { Product } from "../types/product";
import { KrinoMark } from "./KrinoMark";
import "./ProductCard.css";

export function ProductCard({ product }: { product: Product }) {
    return (
        <article className="product-card">
            <Link to={`/product/${product.slug}`} className="product-card__image">
                {product.image ? (
                    <img src={product.image} alt={product.imageAlt} loading="lazy" />
                ) : (
                    <span className="product-card__avatar">
                        <KrinoMark size={40} accent="var(--gold)" mark="var(--gold)" ring={false} />
                    </span>
                )}
            </Link>
            <div className="product-card__body">
                {product.category && <p className="product-card__category">{product.category}</p>}
                <h3 className="product-card__title">
                    <Link to={`/product/${product.slug}`}>{product.title}</Link>
                </h3>
                <p className="product-card__seller">Krino Media</p>
                {product.priceLabel && <p className="product-card__price">{product.priceLabel}</p>}
            </div>
        </article>
    );
}
