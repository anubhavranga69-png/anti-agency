"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const HUBS = [
  { id: "usa",       lat: 37.0902,  lng: -95.7129, label: "United States" },
  { id: "uk",        lat: 51.5074,  lng: -0.1278,  label: "United Kingdom" },
  { id: "india",     lat: 20.5937,  lng: 78.9629,  label: "India" },
  { id: "australia", lat: -25.2744, lng: 133.7751,  label: "Australia" },
  { id: "dubai",     lat: 25.2048,  lng: 55.2708,  label: "Dubai (UAE)" },
];

// Convert lat/lng to 3D point on sphere
function latLngToVector3(lat, lng, radius = 1) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
     (radius * Math.cos(phi)),
     (radius * Math.sin(phi) * Math.sin(theta))
  );
}

// Lerp angle via shortest path
function lerpAngle(current, target, t) {
  let diff = target - current;
  while (diff >  Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return current + diff * t;
}

export default function InteractiveGlobe({ activeRegion = "usa" }) {
  const mountRef   = useRef(null);
  const sceneRef   = useRef(null);
  const rendRef    = useRef(null);
  const globeRef   = useRef(null);
  const frameRef   = useRef(null);
  const markerMeshes = useRef([]);

  // Rotation state
  const rot = useRef({ yaw: 0, pitch: 0.2, targetYaw: 0, targetPitch: 0.2 });
  const drag = useRef({ active: false, lastX: 0, lastY: 0 });
  const autoRotate = useRef(true);
  const autoTimer  = useRef(null);

  // Fly to active hub
  useEffect(() => {
    const hub = HUBS.find(h => h.id === activeRegion);
    if (!hub) return;

    // target yaw so the hub faces camera (camera is at +Z)
    const tYaw   = -(hub.lng * Math.PI / 180);
    const tPitch =   hub.lat * Math.PI / 180 * 0.55;

    rot.current.targetYaw   = tYaw;
    rot.current.targetPitch = Math.max(-0.65, Math.min(0.65, tPitch));
    // Immediately set current rotation to target for smooth transition
    rot.current.yaw = tYaw;
    rot.current.pitch = Math.max(-0.65, Math.min(0.65, tPitch));
    autoRotate.current = false;

    clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => { autoRotate.current = true; }, 5000);
  }, [activeRegion]);

  // Update marker sizes when active changes
  useEffect(() => {
    markerMeshes.current.forEach(({ id, outer, inner, ring }) => {
      const isActive = id === activeRegion;
      outer.scale.setScalar(isActive ? 1.8 : 1.0);
      outer.material.opacity = isActive ? 1 : 0.7;
      ring.visible = isActive;
    });
  }, [activeRegion]);

  // Setup Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Wait for container to have real dimensions
    let W = container.clientWidth || 300;
    let H = container.clientHeight || 300;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none"; // prevent scroll conflict on touch
    container.appendChild(renderer.domElement);
    rendRef.current = renderer;

    // Scene & Camera
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.z = 2.8;
    sceneRef.current = scene;

    // ── Lighting ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffd4b0, 2.2);
    sun.position.set(5, 3, 5);
    scene.add(sun);

    const rimLight = new THREE.DirectionalLight(0xe40101, 0.6);
    rimLight.position.set(-5, -2, -5);
    scene.add(rimLight);

    // ── Texture Loader ──
    const loader = new THREE.TextureLoader();

    // Earth textures from NASA / public CDN
    const earthTexture  = loader.load("https://cdn.jsdelivr.net/npm/three-globe@2.31.2/example/img/earth-blue-marble.jpg");
    const bumpTexture   = loader.load("https://cdn.jsdelivr.net/npm/three-globe@2.31.2/example/img/earth-topology.png");
    const specTexture   = loader.load("https://cdn.jsdelivr.net/npm/three-globe@2.31.2/example/img/earth-water.png");
    const cloudsTexture = loader.load("https://cdn.jsdelivr.net/npm/three-globe@2.31.2/example/img/earth-clouds.png");

    // ── Earth Sphere ──
    const globeGeo = new THREE.SphereGeometry(1, 80, 80);
    const globeMat = new THREE.MeshPhongMaterial({
      map:          earthTexture,
      bumpMap:      bumpTexture,
      bumpScale:    0.04,
      specularMap:  specTexture,
      specular:     new THREE.Color(0x334455),
      shininess:    18,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globeRef.current = globe;
    scene.add(globe);

    // ── Cloud Layer ──
    const cloudGeo = new THREE.SphereGeometry(1.015, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map:         cloudsTexture,
      transparent: true,
      opacity:     0.35,
      depthWrite:  false,
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    globe.add(clouds); // parent to globe so they share rotation

    // ── Atmosphere Glow (shader trick with additive blending) ──
    const atmGeo = new THREE.SphereGeometry(1.08, 64, 64);
    const atmMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0,0,1)), 3.0);
          gl_FragColor = vec4(0.9, 0.05, 0.05, 1.0) * intensity;
        }
      `,
      side:        THREE.FrontSide,
      blending:    THREE.AdditiveBlending,
      transparent: true,
      depthWrite:  false,
    });
    const atmosphere = new THREE.Mesh(atmGeo, atmMat);
    scene.add(atmosphere);

    // ── Star Field ──
    const starGeo = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 2000; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat  = new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.55 });
    const stars    = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Hub Markers ──
    markerMeshes.current = [];
    for (const hub of HUBS) {
      const pos = latLngToVector3(hub.lat, hub.lng, 1.02);
      const isActive = hub.id === activeRegion;

      // Outer glow ring
      const ringGeo = new THREE.RingGeometry(0.025, 0.038, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xe40101, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
      const ring    = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      ring.rotateX(Math.PI / 2);
      ring.visible = isActive;
      globe.add(ring);

      // Outer dot
      const outerGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const outerMat = new THREE.MeshBasicMaterial({ color: 0xe40101, transparent: true, opacity: isActive ? 1 : 0.7 });
      const outer    = new THREE.Mesh(outerGeo, outerMat);
      outer.position.copy(pos);
      outer.scale.setScalar(isActive ? 1.8 : 1.0);
      globe.add(outer);

      // Inner bright core
      const innerGeo = new THREE.SphereGeometry(0.009, 12, 12);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const inner    = new THREE.Mesh(innerGeo, innerMat);
      inner.position.copy(pos);
      globe.add(inner);

      markerMeshes.current.push({ id: hub.id, outer, inner, ring });
    }

    // ── Animation Loop ──
    let pulse = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      pulse += 0.04;

      // Pulse active ring
      const activeMarker = markerMeshes.current.find(m => m.id === activeRegion);
      if (activeMarker?.ring) {
        const s = 1 + Math.sin(pulse) * 0.5;
        activeMarker.ring.scale.setScalar(s);
        activeMarker.ring.material.opacity = 0.4 + Math.sin(pulse) * 0.3;
      }

      // Rotate clouds slightly independently
      if (clouds) clouds.rotation.y += 0.0003;

      if (!drag.current.active) {
        if (autoRotate.current) {
          rot.current.yaw += 0.0025;
          rot.current.targetYaw = rot.current.yaw;
        } else {
          rot.current.yaw   = lerpAngle(rot.current.yaw,   rot.current.targetYaw,   0.12);
          rot.current.pitch = lerpAngle(rot.current.pitch, rot.current.targetPitch, 0.12);
        }
      }

      globe.rotation.y = rot.current.yaw;
      globe.rotation.x = rot.current.pitch;
      atmosphere.rotation.y = rot.current.yaw;
      atmosphere.rotation.x = rot.current.pitch;

      renderer.render(scene, camera);
    };
    animate();

    // ── ResizeObserver for accurate container-based resize ──
    const onResize = (w, h) => {
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onResize(Math.round(width), Math.round(height));
      }
    });
    ro.observe(container);

    // Correct size once after textures start loading
    setTimeout(() => {
      onResize(container.clientWidth, container.clientHeight);
    }, 150);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(frameRef.current);
      clearTimeout(autoTimer.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // run once

  // Drag handlers
  const onPointerDown = (e) => {
    drag.current.active = true;
    drag.current.lastX  = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    drag.current.lastY  = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    autoRotate.current = false;
    clearTimeout(autoTimer.current);
  };
  const onPointerMove = (e) => {
    if (!drag.current.active) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? drag.current.lastX;
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? drag.current.lastY;

    const dx = (x - drag.current.lastX) * 0.007;
    const dy = (y - drag.current.lastY) * 0.007;

    rot.current.yaw   += dx;
    rot.current.pitch  = Math.max(-0.8, Math.min(0.8, rot.current.pitch + dy));
    rot.current.targetYaw   = rot.current.yaw;
    rot.current.targetPitch = rot.current.pitch;

    drag.current.lastX = x;
    drag.current.lastY = y;
  };
  const onPointerUp = () => {
    drag.current.active = false;
    autoTimer.current = setTimeout(() => { autoRotate.current = true; }, 5000);
  };

  return (
    <div
      ref={mountRef}
      className="cursor-grab active:cursor-grabbing select-none"
      style={{ position: "absolute", inset: 0, overflow: "hidden", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    />
  );
}
