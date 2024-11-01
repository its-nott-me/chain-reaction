// so wasted one day on this XD

// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// function TwoOrbs(){
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
//             color: "#0cff00",    // Blue orb color
//             roughness: 0.6,     // Smooth surface
//             metalness: 0.2,     // Slightly metallic appearance
//         });

//         // Create a group to hold both orbs
//         const group = new THREE.Group();

//         // Create the first orb (sphere) mesh
//         const orb1 = new THREE.Mesh(geometry, material);
//         orb1.castShadow = true;  // Enable shadow casting for the orb
//         orb1.position.x = -0.07;  // Position the first orb closer to the center
//         group.add(orb1);

//         // Create the second orb (sphere) mesh
//         const orb2 = new THREE.Mesh(geometry, material);
//         orb2.castShadow = true;  // Enable shadow casting for the second orb
//         orb2.position.x = 0.07;   // Position the second orb closer to the center
//         group.add(orb2);

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
//             x: (Math.random() - 0.5) * 0.02, // Random speed for x rotation
//             y: (Math.random() - 0.5) * 0.02, // Random speed for y rotation
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

// export default TwoOrbs;















// wasted another day on this LoL

// import React, { useEffect, useRef } from "react";
// import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, ArcRotateCamera, ShadowGenerator, PointLight } from "@babylonjs/core";
// import "@babylonjs/loaders"; // Optional: needed if you plan on using external models in Babylon.js

// function TwoOrbs() {
//     const mountRef = useRef(null);

//     useEffect(() => {
//         // Create the Babylon.js engine and ensure the canvas is correctly attached
//         const canvas = mountRef.current;
//         const engine = new Engine(canvas, true); // Create engine
//         const scene = new Scene(engine); // Create scene

//         // Camera setup
//         const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), scene);
//         camera.attachControl(canvas, true); // Attach controls to the canvas

//         // Lighting setup
//         const light = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
//         light.intensity = 0.7;

//         // Point light for dynamic lighting
//         const pointLight = new PointLight("pointLight", new Vector3(5, 5, 5), scene);
//         pointLight.intensity = 1;

//         // Orb (sphere) geometry
//         const orb1 = MeshBuilder.CreateSphere("orb1", { diameter: 2, segments: 32 }, scene);
//         const orb2 = MeshBuilder.CreateSphere("orb2", { diameter: 2, segments: 32 }, scene);

//         // Material for the orbs
//         const orbMaterial = new StandardMaterial("orbMaterial", scene);
//         orbMaterial.diffuseColor = new Color3(0, 1, 0); // Green color
//         orb1.material = orbMaterial;
//         orb2.material = orbMaterial;

//         // Adjust the positions of the orbs to prevent overlap
//         orb1.position.x = -0.7; // Position the first orb slightly left
//         orb2.position.x = 0.7;  // Position the second orb slightly right

//         // Shadow setup
//         const shadowGenerator = new ShadowGenerator(1024, pointLight);
//         shadowGenerator.addShadowCaster(orb1);
//         shadowGenerator.addShadowCaster(orb2);

//         // Animation variables
//         const vibrationSpeed = 0.65; // Speed of the vibration
//         const vibrationAmplitude = 0.015; // Amplitude of the vibration

//         const animate = () => {
//             // Apply vibration effect to the orbs
//             orb1.position.y = Math.sin(Date.now() * vibrationSpeed) * vibrationAmplitude;
//             orb2.position.y = Math.sin(Date.now() * vibrationSpeed * 1.1) * vibrationAmplitude;

//             scene.render();
//         };

//         engine.runRenderLoop(animate);

//         // Resize engine on window resize
//         const resizeHandler = () => {
//             engine.resize();
//         };
//         window.addEventListener("resize", resizeHandler);

//         // Cleanup
//         return () => {
//             engine.dispose();
//             window.removeEventListener("resize", resizeHandler);
//         };
//     }, []);

//     return <canvas ref={mountRef} style={{ 
//         width: "60px",  /* Adjust width of each cell */
//         height: "60px", /* Adjust height of each cell */
//         display: "flex",
//         alignItems: "center",  /* Center orbs vertically */
//         justifyContent: "center", /* Center orbs horizontally */ 
//         overflow: "hidden",
//     }} />;
// }

// export default TwoOrbs;




// finally settling on this one
import React from 'react';
import './SampleOrb.css'; // Import the CSS file

const getRandomDuration = () => `${Math.random() * 5 + 3}s`; // Random duration between 3s and 8s
const getRandomDelay = () => `${Math.random() * 1.5}s`; // Random delay between 0s and 2s

const TwoOrb = ({ color }) => {
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
                        top: "5px",
                    }}
                >
                    <span className="shadow"></span>
                </figure>
                <figure
                    className="ball second"
                    style={{
                        background: `radial-gradient(circle at 12px 12px, ${color}, #000)`,
                        top: "-4px",
                    }}
                >
                    <span className="shadow"></span>
                </figure>
            </div>
        </section>
    );
};

export default TwoOrb;

