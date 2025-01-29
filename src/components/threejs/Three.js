import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

const ThreeScene = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  let model = null;

  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffeedd, 2);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffaa00, 5, 10);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 4, 0.5);
    spotLight.position.set(-2, 2, 3);
    scene.add(spotLight);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;
    containerRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load('/assets/paradox/scene.gltf', (gltf) => {
      model = gltf.scene;
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0xffa500); // Orange glow
          child.material.emissiveIntensity = 0.6;
        }
      });
    }, undefined, (error) => {
      console.error('Error loading GLTF model:', error);
    });

    // Controls
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 0.01;
    controls.rollSpeed = 0.0001;
    controls.autoForward = true;
    controls.dragToLook = false; // Disable drag to look

    // Mouse Move Interaction
    const onMouseMove = (event) => {
      const { movementX, movementY } = event;
      camera.rotation.y -= movementX * 0.00002;
      camera.rotation.x -= movementY * 0.00002;
    };
    window.addEventListener('mousemove', onMouseMove);

    // EffectComposer
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    // Clock for delta time
    const clock = new THREE.Clock();

    // Resize Event Listener
    const onWindowResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      composer.setSize(sizes.width, sizes.height); // Update composer size
    };
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    const animate = () => {
      const delta = clock.getDelta();
      controls.update(delta);
      if (model) {
        model.rotation.y += 0.005; // Rotate model around Y-axis
      }
      composer.render();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationRef.current);
      controls.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
