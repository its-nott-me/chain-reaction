import React from 'react';
import './SampleOrb.css'; // Import the CSS file

const getRandomDuration = () => `${Math.random() * 5 + 3}s`; // Random duration between 3s and 8s
const getRandomDelay = () => `${Math.random() * 2}s`; // Random delay between 0s and 2s

function SampleOrb(){
    return (
        <section className="stage">
            <div
                className="orb-group"
                style={{
                    animationDuration: getRandomDuration(),
                    animationDelay: getRandomDelay(),
                }}
            >
                <figure className="ball second">
                    <span className="shadow"></span>
                </figure>
            </div>
        </section>
    );
};

export default SampleOrb;
