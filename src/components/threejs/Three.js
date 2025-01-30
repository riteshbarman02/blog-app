// src/ThreeScene.js
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeScene = () => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  let model = null;
  let clock = new THREE.Clock();
  const spheres = [];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 10000);
    camera.position.set(15, 6, 0);
    scene.add(camera);

    // Generate random spheres with physics
    for (let i = 0; i < 100; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 + 5, Math.random() * 10 - 5);
      sphere.userData.velocity = new THREE.Vector3(0, -0.02 - Math.random() * 0.05, 0);
      sphere.userData.bounce = false;
      spheres.push(sphere);
      scene.add(sphere);
    }
    //add a plane
    const planeGeometry = new THREE.PlaneGeometry(7.5, 15);  
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0Xff00ff, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(-0.6, -2, 0.6);
    plane.rotation.x = Math.PI / 2;
    scene.add(plane);


    // Lights
    const ambientLight = new THREE.AmbientLight(0xffff00, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffeedd, 2);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffaa00, 5, 20);
    pointLight.position.set(0, 1, 2);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 4, 0.5);
    spotLight.position.set(-2, 2, 3);
    scene.add(spotLight);

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load('/assets/gaming_desktop/scene.gltf', (gltf) => {
      model = gltf.scene;
      model.position.set(0, -2, -1);
      scene.add(model);
    });
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Resize Function
    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    // Animation Loop
    const animate = () => {
      controls.update();
      const deltaTime = clock.getDelta();
    
      spheres.forEach((sphere) => {
        sphere.position.addScaledVector(sphere.userData.velocity, deltaTime * 60);
    
        const planeMinX = -2.75;  // Plane's left boundary
        const planeMaxX = 2.75;   // Plane's right boundary
        const planeMinZ = -4.5;   // Plane's top boundary
        const planeMaxZ = 4.5;    // Plane's bottom boundary
        const planeY = -1;        // Plane's height
    
        // Check if sphere is within the plane's x and z boundaries
        const isInsidePlane =
          sphere.position.x >= planeMinX && sphere.position.x <= planeMaxX &&
          sphere.position.z >= planeMinZ && sphere.position.z <= planeMaxZ;
    
        if (sphere.position.y <= planeY + 0.1 && isInsidePlane) {
          // Apply deceleration when inside the plane's bounds
          sphere.userData.velocity.y = 0;
    
          if (Math.abs(sphere.userData.velocity.y) < 0.001) {
            sphere.userData.velocity.y = 0;  // Stop completely when slow enough
          }
    
          // Keep the sphere on the plane level
          sphere.position.y = Math.max(sphere.position.y, planeY + 0.05);
        }
    
        if (model) {
          const modelBox = new THREE.Box3().setFromObject(model);
          const sphereBox = new THREE.Box3().setFromObject(sphere);
    
          if (modelBox.intersectsBox(sphereBox) && !sphere.userData.bounce) {
            sphere.userData.velocity.x = (Math.random() - 0.5) * 0.2;
            sphere.userData.velocity.z = (Math.random() - 0.5) * 0.2;
            sphere.userData.bounce = true;
          }
        }
    
        // Reset sphere if it falls below y = -5 (outside the plane area)
        if (sphere.position.y < -5) {
          sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 + 5, Math.random() * 10 - 5);
          sphere.userData.velocity.set(0, -0.02 - Math.random() * 0.05, 0);
          sphere.userData.bounce = false;
        }
      });
    
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    
    animate();

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeRenderer);
      cancelAnimationFrame(animationRef.current);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }} />;
};

export default ThreeScene;
