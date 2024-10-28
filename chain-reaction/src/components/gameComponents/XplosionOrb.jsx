import React from "react";
import "./XplosionOrb.css"; // Assume CSS file for specific styles

function XplosionOrb({destination, color}) {
    return (
        <section className="xplosion-orb-stage">
            <div className="xplosion-orb-group">
                <figure className={`xplosion-ball ${destination}`} style={{background: `radial-gradient(circle at 12px 12px, ${color}, #000)`}} >
                    <span className="xplosion-shadow"></span>
                </figure>
            </div>
        </section>
    );
}

export default XplosionOrb;
