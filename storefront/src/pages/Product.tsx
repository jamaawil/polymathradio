import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug, isGhostConfigured } from "../lib/ghost";
import type { Product } from "../types/product";
import { BuyButton } from "../components/BuyButton";
import { ConfigWarning } from "../components/ConfigWarning";

export function ProductPage() {
    const { slug } = useParams<{ slug: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        getProductBySlug(slug)
            .then(setProduct)
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [slug]);

    if (!isGhostConfigured()) {
        return (
            <div className="page-inner">
                <ConfigWarning />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="page-inner">
                <p className="discover-status">Loading&hellip;</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="page-inner">
                <p className="discover-status discover-status--error">
                    Couldn't find that product. <Link to="/">Back to Shop</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="page-inner product-detail">
            <Link to="/" className="product-detail__back">
                &larr; Back to Shop
            </Link>
            <div className="product-detail__grid">
                {product.image && (
                    <img className="product-detail__image" src={product.image} alt={product.imageAlt} />
                )}
                <div className="product-detail__body">
                    {product.category && <p className="product-detail__category">{product.category}</p>}
                    <h1>{product.title}</h1>
                    <p className="product-detail__seller">Krino Media</p>
                    {product.priceLabel && <p className="product-detail__price">{product.priceLabel}</p>}
                    <p className="product-detail__description">{product.description}</p>
                    <BuyButton checkoutUrl={product.checkoutUrl} ghostUrl={product.ghostUrl} />
                </div>
            </div>
        </div>
    );
}
