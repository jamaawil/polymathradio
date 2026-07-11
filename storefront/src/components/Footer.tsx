import { MAIN_SITE_URL } from "../config";
import "./Footer.css";

export function Footer() {
    return (
        <footer className="store-footer">
            <div className="store-footer__inner">
                <p className="store-footer__tagline">Sift the noise.</p>
                <p>Support the work you read, watch, and listen to.</p>
                <nav className="store-footer__nav" aria-label="Krino Media">
                    <a href={MAIN_SITE_URL}>Home</a>
                    <a href={`${MAIN_SITE_URL}/about/`}>About Us</a>
                    <a href={`${MAIN_SITE_URL}/contact/`}>Contact</a>
                </nav>
                <p className="store-footer__meta">&copy; {new Date().getFullYear()} Krino Media.</p>
            </div>
        </footer>
    );
}
