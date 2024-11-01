// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// function ThreeOrbs(){
//     const mountRef = useRef(null);

//     useEffect(() => {
//         // Scene setup
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         const renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         renderer.shadowMap.enabled = true;  // Enable shadow map
//         mountRef.current.appendChild(renderer.domElement);

//         // Orb (sphere) geometry setup
//         const geometry = new THREE.SphereGeometry(0.1, 32, 32);

//         // Use MeshStandardMaterial for lighting interaction
//         const material = new THREE.MeshStandardMaterial({
//             color: 0x0077ff,    // Blue orb color
//             roughness: 0.6,     // Smooth surface
//             metalness: 0.2,     // Slightly metallic appearance
//         });

//         // Create a group to hold all three orbs
//         const group = new THREE.Group();

//         // Create the first orb (top orb) mesh
//         const orb1 = new THREE.Mesh(geometry, material);
//         orb1.castShadow = true;  // Enable shadow casting for the orb
//         orb1.position.set(0, 0.1, 0);  // Position the first orb at the top of the V
//         group.add(orb1);

//         // Create the second orb (left bottom orb) mesh
//         const orb2 = new THREE.Mesh(geometry, material);
//         orb2.castShadow = true;  // Enable shadow casting for the second orb
//         orb2.position.set(0.1, 0, 0);  // Position the second orb to the left bottom
//         group.add(orb2);

//         // Create the third orb (right bottom orb) mesh
//         const orb3 = new THREE.Mesh(geometry, material);
//         orb3.castShadow = true;  // Enable shadow casting for the third orb
//         orb3.position.set(-0.1, 0, 0);  // Position the third orb to the right bottom
//         group.add(orb3);

//         // Set the position of the group to the center of the scene
//         group.position.set(0, 0, 0);
//         scene.add(group);

//         // Add lighting to make the material look 3D
//         const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft ambient light
//         scene.add(ambientLight);

//         // Add a point light to simulate a light source that emits light in all directions
//         const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//         pointLight.position.set(5, 5, 5); // Position the light
//         pointLight.castShadow = true;     // Enable shadow casting for the light
//         scene.add(pointLight);

//         // Add a directional light to simulate sunlight
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
//         directionalLight.position.set(15, -1, 12); // Position the directional light
//         directionalLight.castShadow = true;       // Enable shadow casting
//         scene.add(directionalLight);

//         // Set shadow settings for directional light
//         directionalLight.shadow.mapSize.width = 1024;  // Shadow map resolution
//         directionalLight.shadow.mapSize.height = 1024;
//         directionalLight.shadow.camera.near = 0.5;     // How near the shadow can be seen
//         directionalLight.shadow.camera.far = 500;

//         camera.position.z = 5;

//         // Variables for vibration effect
//         const vibrationSpeed = 0.65; // Speed of the vibration
//         const vibrationAmplitude = 0.015; // Amplitude of the vibration (how much it moves)

//         // Random rotation speed for each axis
//         const rotationSpeed = {
//             x: (Math.random() - 0.5) * 0.1, // Random speed for x rotation
//             y: (Math.random() - 0.5) * 0.05, // Random speed for y rotation
//             z: (Math.random() - 0.5) * 0.02  // Random speed for z rotation
//         };

//         // Animation loop
//         const animate = () => {
//             requestAnimationFrame(animate);

//             // Apply random rotation to the group
//             group.rotation.x += rotationSpeed.x;
//             group.rotation.y += rotationSpeed.y;
//             group.rotation.z += rotationSpeed.z;

//             // Apply vibration effect to the group
//             group.position.x = Math.sin(Date.now() * vibrationSpeed) * vibrationAmplitude;
//             group.position.y = Math.sin(Date.now() * vibrationSpeed * 1.1) * vibrationAmplitude;

//             // Render the scene
//             renderer.render(scene, camera);
//         };

//         animate();

//         // Cleanup function to remove the renderer
//         return () => {
//             if (mountRef.current) {
//                 mountRef.current.removeChild(renderer.domElement);
//             }

//             // Properly dispose of Three.js resources to prevent memory leaks
//             geometry.dispose();
//             material.dispose();
//             renderer.dispose();

//             // Remove all children from the scene (in case other objects were added)
//             while (scene.children.length > 0) {
//                 scene.remove(scene.children[0]);
//             }
//         };
//     }, []);

//     return <div ref={mountRef} style={{ 
//         width: "60px",  /* Adjust width of each cell */
//         height: "60px", /* Adjust height of each cell */
//         display: "flex",
//         alignItems: "center",  /* Center orbs vertically */
//         justifyContent: "center", /* Center orbs horizontally */ 
//         overflow: "hidden",
//         }} 
//     />;};

// export default ThreeOrbs;


import React from 'react';
import './SampleOrb.css'; // Import the CSS file

const getRandomDuration = () => `${Math.random() * 5 + 3}s`; // Random duration between 3s and 8s
const getRandomDelay = () => `${Math.random() * 1.5}s`; // Random delay between 0s and 2s

const ThreeOrbs = ({ color }) => {
    return (
        <section className="stage">
            <div
                className="orb-group"
                style={{
                    animationDuration: getRandomDuration(),
                    // animationDelay: getRandomDelay(),
                }}
            >
                <figure
                    className="ball"
                    style={{
                        background: `radial-gradient(circle at 12px 12px, ${color}, #000)`,
                        top: "13px",
                        left: "5px"
                    }}
                >
                    <span className="shadow"></span>
                </figure>
                <figure
                    className="ball second"
                    style={{
                        background: `radial-gradient(circle at 12px 12px, ${color}, #000)`,
                        top: "1px",
                    }}
                >
                    <span className="shadow"></span>
                </figure>
                <figure
                    className="ball third"
                    style={{
                        background: `radial-gradient(circle at 12px 12px, ${color}, #000)`,
                        top: "-13px",
                        right: "-6px",
                    }}
                >
                    <span className="shadow"></span>
                </figure>
            </div>
        </section>
    );
};

export default ThreeOrbs;
