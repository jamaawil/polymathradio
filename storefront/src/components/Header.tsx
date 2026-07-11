import { Link } from "react-router-dom";
import { KrinoMark } from "./KrinoMark";
import { MAIN_SITE_URL } from "../config";
import "./Header.css";

export function Header() {
    return (
        <header className="store-header">
            <div className="store-header__bar">
                <a className="store-header__logo" href={MAIN_SITE_URL}>
                    <KrinoMark size={32} />
                    <span className="store-header__wordmark">
                        KRINO <span className="store-header__wordmark-sub">SHOP</span>
                    </span>
                </a>

                <nav className="store-header__nav" aria-label="Krino Media">
                    <a href={`${MAIN_SITE_URL}/watch/`}>Watch</a>
                    <a href={`${MAIN_SITE_URL}/listen/`}>Listen</a>
                    <a href={`${MAIN_SITE_URL}/read/`}>Read</a>
                    <a href={`${MAIN_SITE_URL}/learn/`}>Learn</a>
                    <Link to="/" className="is-current">
                        Shop
                    </Link>
                </nav>
            </div>
        </header>
    );
}
