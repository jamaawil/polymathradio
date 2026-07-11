import { NavLink } from "react-router-dom";
import "./CategoryNav.css";

const CATEGORIES = [
    { slug: "", label: "All" },
    { slug: "reports", label: "Reports" },
    { slug: "merch", label: "Merch" },
    { slug: "certificates", label: "Certificates" },
];

export function CategoryNav() {
    return (
        <nav className="category-nav" aria-label="Shop categories">
            {CATEGORIES.map((c) => (
                <NavLink
                    key={c.slug}
                    to={c.slug ? `/category/${c.slug}` : "/"}
                    end
                    className={({ isActive }) => (isActive ? "category-nav__item is-active" : "category-nav__item")}
                >
                    {c.label}
                </NavLink>
            ))}
        </nav>
    );
}
