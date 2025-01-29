// src/ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const containerRef = useRef(null); // To reference the container
  const animationRef = useRef(null); // To hold the animation frame ID

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();

    // Lights
    const light1 = new THREE.PointLight(0xffffff, 1, 100);
    light1.position.set(0, 20, -10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 1, 100);
    light2.position.set(0, 20, 0);
    scene.add(light2);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 20, 20);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Create cubes
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xff00ff, transparent: true }),
      new THREE.MeshStandardMaterial({ color: 0xf64a8a, transparent: true }),
      new THREE.MeshStandardMaterial({ color: 0xff69b4, transparent: true }),
    ];

    const cubes = [
      new THREE.Mesh(geometry, materials[0]),
      new THREE.Mesh(geometry, materials[1]),
      new THREE.Mesh(geometry, materials[2]),
    ];

    cubes[0].position.x = -2;
    cubes[1].position.x = 0;
    cubes[2].position.x = 2;

    cubes.forEach(cube => scene.add(cube));

    // Resize event listener
    const onWindowResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    const animate = () => {
      cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.011;
      });

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate); // Save frame ID
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationRef.current); // Cancel animation frame
    
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
