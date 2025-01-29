// src/ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  let model = null;

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable transparency
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Fully transparent background (alpha = 0)
    containerRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 0, 5000);
    scene.add(camera);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffff00, 1);
    scene.add(ambientLight);

    // Directional Light (Sunlight Effect)
    const directionalLight = new THREE.DirectionalLight(0xffeedd, 2);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    // Point Light (Glowing Effect)
    const pointLight = new THREE.PointLight(0xffaa00, 5, 10);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    // Spot Light (Focused Highlight)
    const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 4, 0.5);
    spotLight.position.set(-2, 2, 3);
    scene.add(spotLight);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load('/assets/modern_gaming_setup/scene.gltf', (gltf) => {
      model = gltf.scene;
      scene.add(model);

      // Adjust material for glow
      // model.traverse((child) => {
      //   if (child.isMesh) {
      //     child.material.emissive = new THREE.Color(0xffa500); // Orange glow
      //     child.material.emissiveIntensity = 0.6;
      //   }
      // });
    });
   
    // Smoke Particle System (Using Sprites)
    const smokeParticles = new THREE.Group();
    scene.add(smokeParticles);


  

    // Controls
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 0.01;
    controls.rollSpeed = 0.0001;
    controls.autoForward = true;
    controls.dragToLook = true;

    // Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      controls.update(delta);
      if (model) model.rotation.y += 0.005;

      // Update smoke particles' positions to simulate drifting
      

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize Listener
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationRef.current);
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};

export default ThreeScene;
