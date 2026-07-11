import { useEffect } from "react";
import { ensureLemonSqueezyLoaded } from "../lib/lemonsqueezy";
import "./BuyButton.css";

export function BuyButton({ checkoutUrl, ghostUrl }: { checkoutUrl: string | null; ghostUrl: string }) {
    useEffect(() => {
        if (checkoutUrl) {
            ensureLemonSqueezyLoaded();
        }
    }, [checkoutUrl]);

    if (!checkoutUrl) {
        return (
            <div className="buy-button-placeholder">
                <p>This product isn't connected to checkout yet.</p>
                <a href={ghostUrl} target="_blank" rel="noopener noreferrer">
                    View on Krino Media &rarr;
                </a>
            </div>
        );
    }

    // Any <a class="lemonsqueezy-button"> on the page opens Lemon
    // Squeezy's overlay checkout when clicked — no extra JS needed here
    // once their script has loaded (see lib/lemonsqueezy.ts). If the
    // checkout URL turns out to be a Gumroad/Stripe link instead, this
    // still works as a plain link (opens their hosted checkout).
    return (
        <a className="buy-button lemonsqueezy-button" href={checkoutUrl}>
            Buy now
        </a>
    );
}
