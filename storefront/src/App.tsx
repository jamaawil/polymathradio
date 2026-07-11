import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Discover } from "./pages/Discover";
import { ProductPage } from "./pages/Product";

export default function App() {
    return (
        <BrowserRouter>
            <a className="skip-link" href="#main-content">
                Skip to content
            </a>
            <Header />
            <main id="main-content">
                <Routes>
                    <Route path="/" element={<Discover />} />
                    <Route path="/category/:category" element={<Discover />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
