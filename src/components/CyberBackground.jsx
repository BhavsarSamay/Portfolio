import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

export default function CyberBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track scroll with smooth lerp
    let scrollY = window.scrollY || 0;
    let smoothScrollY = scrollY;
    let lastScrollY = scrollY;
    let scrollCooldown = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      initMicroObjects();
      initAsteroids();
    };

    // ==========================================
    // METEORS & COMETS SYSTEM (WITH SCROLL-TRIGGER)
    // ==========================================
    const comets = [];
    let ambientCometTimer = 100;

    const spawnMeteor = (isScrollTriggered = false, scrollDelta = 0) => {
      // Spawn from top or top-sides
      const fromLeft = Math.random() < 0.65;
      const startX = fromLeft
        ? Math.random() * (width * 0.7) - 40
        : Math.random() * (width * 0.5) + width * 0.5;
      const startY = Math.random() * (height * 0.45) - 30;

      // Base angle: diagonal downwards (~42° to ~58°)
      let angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.32;
      if (!fromLeft) {
        angle = (3 * Math.PI / 4) + (Math.random() - 0.5) * 0.32;
      }

      // If scrolling up fast, allow occasional upward-leaning meteors
      if (scrollDelta < -20) {
        angle -= 0.25;
      }

      const speed = isScrollTriggered
        ? Math.random() * 12 + 20 // Ultra-fast streak on scroll
        : Math.random() * 10 + 15;

      const length = isScrollTriggered
        ? Math.random() * 140 + 170 // Longer, cinematic tail
        : Math.random() * 110 + 110;

      // Deep Navy & Sapphire Color Palettes
      const isNavyTheme = Math.random() < 0.70;
      const colorHead = isDark
        ? (isNavyTheme ? "#E0F2FE" : "#A7F3D0")
        : (isNavyTheme ? "#0369A1" : "#0A7A5F");
      const colorMid = isDark
        ? (isNavyTheme ? "#38BDF8" : "#34D399")
        : (isNavyTheme ? "#0284C7" : "#059669");
      const colorTail = isDark
        ? (isNavyTheme ? "#1E3A8A" : "#065F46") // Deep royal navy blue
        : (isNavyTheme ? "#172554" : "#064E3B");

      comets.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length,
        alpha: 1,
        decay: isScrollTriggered ? 0.022 : 0.014,
        colorHead,
        colorMid,
        colorTail,
        isScrollTriggered,
      });
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY || 0;
      const delta = currentScrollY - scrollY;
      scrollY = currentScrollY;

      // Shoot meteor when user scrolls!
      if (Math.abs(delta) > 10 && scrollCooldown <= 0) {
        spawnMeteor(true, delta);
        // Occasionally trigger a secondary fast navy meteor if scrolling vigorously
        if (Math.abs(delta) > 40 && Math.random() < 0.5) {
          setTimeout(() => spawnMeteor(true, delta), 80);
        }
        scrollCooldown = 16; // Throttle to prevent screen flooding
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // Interactive mouse coordinates
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: 220,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    // Gravitational Shockwaves on Click
    const shockwaves = [];
    const handleClick = (e) => {
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.42,
        alpha: 0.85,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("click", handleClick);

    // ==========================================
    // 1. STARFIELD (BALANCED DENSITY & PROPORTIONS)
    // ==========================================
    let stars = [];
    const initStars = () => {
      const count = Math.min(Math.floor((width * height) / 5000), 200);
      stars = [];
      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.60 ? 0 : Math.random() < 0.88 ? 1 : 2;
        const speed = layer === 0 ? 0.08 : layer === 1 ? 0.20 : 0.44;
        const size = layer === 0 ? Math.random() * 1.2 + 0.5 : layer === 1 ? Math.random() * 1.6 + 1.0 : Math.random() * 2.3 + 1.6;
        const baseAlpha = layer === 0 ? Math.random() * 0.35 + 0.30 : layer === 1 ? Math.random() * 0.45 + 0.40 : Math.random() * 0.35 + 0.65;

        // Rich celestial palette with Navy Blue, Ice Cyan & Emerald
        const colorPalette = isDark
          ? ["#FFFFFF", "#38BDF8", "#34D399", "#93C5FD", "#60A5FA", "#1D4ED8", "#C084FC"]
          : ["#0A7A5F", "#0284C7", "#1E40AF", "#0369A1", "#475569", "#6366F1"];
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        stars.push({
          x: Math.random() * width,
          baseY: Math.random() * (height * 3.8) - height * 0.4,
          size,
          layer,
          speed,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.035 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          color,
          hasSpikes: layer === 2 && Math.random() < 0.35,
        });
      }
    };
    initStars();

    // ==========================================
    // 2. TINY OBJECTS & NAVY BLUE MICRO-DEBRIS
    // ==========================================
    let microObjects = [];
    const initMicroObjects = () => {
      microObjects = [];
      const numObjects = 36;
      for (let i = 0; i < numObjects; i++) {
        const isNavy = Math.random() < 0.75;
        const color = isDark
          ? (isNavy
              ? ["#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"][Math.floor(Math.random() * 6)]
              : ["#10B981", "#34D399", "#A7F3D0"][Math.floor(Math.random() * 3)])
          : (isNavy
              ? ["#1E40AF", "#1D4ED8", "#0284C7", "#0369A1"][Math.floor(Math.random() * 4)]
              : ["#0A7A5F", "#059669"][Math.floor(Math.random() * 2)]);

        const type = Math.random() < 0.45 ? "dust" : Math.random() < 0.8 ? "prism" : "satellite";
        const size = type === "dust" ? Math.random() * 1.5 + 0.8 : type === "prism" ? Math.random() * 3.2 + 2.0 : 4.5;

        microObjects.push({
          x: Math.random() * width,
          baseY: Math.random() * (height * 3.6),
          driftX: (Math.random() - 0.5) * 0.35,
          driftY: (Math.random() - 0.5) * 0.25,
          scrollFactor: Math.random() * 0.28 + 0.12,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.025,
          size,
          type,
          color,
          baseAlpha: Math.random() * 0.45 + 0.35,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };
    initMicroObjects();

    // Tiny Orbital Deep-Space Probes with Solar Wings & Telemetry LED
    const deepSpaceProbes = [
      {
        baseX: 0.24,
        baseY: 260,
        scrollFactor: 0.16,
        vx: 0.08,
        vy: 0.04,
        beaconPhase: 0,
      },
      {
        baseX: 0.82,
        baseY: 1950,
        scrollFactor: 0.22,
        vx: -0.06,
        vy: 0.03,
        beaconPhase: 2.1,
      },
    ];

    // ==========================================
    // 3. CURATED CELESTIAL BODIES (PERFECTLY PROPORTIONED)
    // ==========================================

    // Celestial 1: Bright Luminous Ringed Gas Giant ("Chronos") -> Visible at Top-Right / Hero
    const ringedPlanet = {
      baseX: 0.89,
      baseY: 175,
      scrollFactor: 0.16,
      radius: 82,
      ringTilt: -0.40,
      ringInner: 104,
      ringOuter: 176,
      moon: {
        orbitA: 220,
        orbitB: 68,
        angle: 1.2,
        speed: 0.007,
        radius: 7,
      }
    };

    // Celestial 2: Deep Navy Blue Celestial Giant ("Poseidon-Prime") -> Visible at Top-Left / Hero
    // Creates a stunning cosmic space panorama across the upper cosmos
    const navyPlanet = {
      baseX: 0.11,
      baseY: 160,
      scrollFactor: 0.14,
      radius: 46,
      ringTilt: 0.32,
      ringInner: 58,
      ringOuter: 80,
      moon: {
        orbitA: 106,
        orbitB: 36,
        angle: 3.4,
        speed: 0.011,
        radius: 3.8,
      }
    };

    // Celestial 3: Emerald Terrestrial Planet ("Veracity Prime") -> Visible at Intro/Platforms (Scroll ~900-2000)
    const terrestrialPlanet = {
      baseX: 0.08,
      baseY: 820,
      scrollFactor: 0.26,
      radius: 52,
      satellite: {
        orbitA: 96,
        orbitB: 38,
        angle: 2.8,
        speed: 0.016,
        radius: 4.5,
      }
    };

    // Celestial 4: Golden Gas Giant ("Solaria Prime") -> Visible at Projects / Work (Scroll ~1800-3400)
    const solariaPlanet = {
      baseX: 0.88,
      baseY: 1320,
      scrollFactor: 0.26,
      radius: 64,
      ringTilt: 0.38,
      ringInner: 82,
      ringOuter: 146,
      moon: {
        orbitA: 178,
        orbitB: 56,
        angle: 0.8,
        speed: 0.009,
        radius: 5.5,
      },
    };

    // Celestial 5: High-Energy Violet/Amethyst Pulsar & Magnetar ("Vela-X") -> Visible at How I Think (Scroll ~3200-4600)
    const velaPulsar = {
      baseX: 0.12,
      baseY: 1780,
      scrollFactor: 0.26,
      radius: 30,
      jetAngle: 0.65,
      jetLength: 170,
      jetWobbleSpeed: 0.025,
      accretionParticles: Array.from({ length: 18 }, (_, i) => ({
        dist: Math.random() * 45 + 36,
        angle: (i / 18) * Math.PI * 2,
        speed: Math.random() * 0.028 + 0.02,
        size: Math.random() * 2.2 + 1.2,
        color: Math.random() < 0.6 ? "#E879F9" : "#A855F7",
      })),
    };

    // Celestial 6: Electric Cyan & Sapphire Ice Giant ("Neptis Core") -> Visible at Skills & Experience (Scroll ~4400-5800)
    const neptisPlanet = {
      baseX: 0.87,
      baseY: 2260,
      scrollFactor: 0.26,
      radius: 56,
      ringTilt: -0.28,
      ringInner: 72,
      ringOuter: 116,
      moon1: {
        orbitA: 132,
        orbitB: 46,
        angle: 1.4,
        speed: 0.012,
        radius: 4.8,
      },
      moon2: {
        orbitA: 184,
        orbitB: 64,
        angle: 4.1,
        speed: -0.008,
        radius: 3.4,
      },
    };

    // Celestial 7: Deep Space Accretion Singularity ("Cygnus-X1") -> Visible during transition into Tech Stack (Scroll ~4000-5200)
    const blackHole = {
      baseX: 0.15,
      baseY: 2150,
      scrollFactor: 0.26,
      eventHorizonRadius: 24,
      photonRingRadius: 30,
      diskInner: 36,
      diskOuter: 92,
      diskTilt: 0.40,
      rotation: 0,
      accretionParticles: Array.from({ length: 14 }, (_, i) => ({
        dist: Math.random() * 52 + 34,
        angle: (i / 14) * Math.PI * 2,
        speed: Math.random() * 0.022 + 0.016,
        size: Math.random() * 2 + 1,
        color: Math.random() < 0.6 ? "#F59E0B" : "#38BDF8"
      }))
    };

    // Celestial 8: Coral & Ruby World with Dyson Array ("Ares Gateway") -> Visible at Contact & Footer (Scroll ~5600-7200)
    const aresPlanet = {
      baseX: 0.11,
      baseY: 2750,
      scrollFactor: 0.26,
      radius: 48,
      dysonOrbitA: 98,
      dysonOrbitB: 36,
      dysonTilt: 0.32,
      nodes: [
        { angle: 0, speed: 0.012, phase: 0 },
        { angle: (Math.PI * 2) / 3, speed: 0.012, phase: 2.1 },
        { angle: (Math.PI * 4) / 3, speed: 0.012, phase: 4.2 },
      ],
    };

    // ==========================================
    // 4. SUBTLE FLOATING ASTEROIDS (NAVY & OBSIDIAN ROCKS)
    // ==========================================
    let asteroids = [];
    const initAsteroids = () => {
      asteroids = [];
      const numAsteroids = 8;
      for (let i = 0; i < numAsteroids; i++) {
        const vertices = [];
        const numPoints = Math.floor(Math.random() * 3) + 5;
        const rad = Math.random() * 6 + 4;
        for (let p = 0; p < numPoints; p++) {
          const angle = (p / numPoints) * Math.PI * 2;
          const r = rad * (0.75 + Math.random() * 0.5);
          vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }

        asteroids.push({
          baseX: (0.04 + (i / numAsteroids) * 0.32) * width + (Math.random() - 0.5) * 50,
          baseY: 1550 + (i * 75) + (Math.random() - 0.5) * 40,
          scrollFactor: 0.26,
          vertices,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.016,
          color: isDark ? (i % 2 === 0 ? "#1E293B" : "#1E3A8A") : (i % 2 === 0 ? "#94A3B8" : "#3B82F6"),
          alpha: isDark ? 0.48 : 0.32,
          rad,
        });
      }
    };
    initAsteroids();

    // ==========================================
    // 5. ANIMATION LOOP
    // ==========================================
    let frame = 0;

    const render = () => {
      frame++;

      if (scrollCooldown > 0) scrollCooldown--;

      const scrollVelocity = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
      const warpStretch = Math.min(scrollVelocity * 0.25, 12);

      smoothScrollY += (scrollY - smoothScrollY) * 0.08;

      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // ----------------------------------------------------
      // A. VOLUMETRIC NEBULAE (BACKGROUND DEPTH & COLOR)
      // ----------------------------------------------------
      const breath1 = Math.sin(frame * 0.007) * 35;
      const breath2 = Math.cos(frame * 0.005) * 30;

      // 1. Radiant Emerald Nebula (Backing Chronos at top-right)
      const neb1Y = 190 - smoothScrollY * 0.12 + breath1;
      const gradNeb1 = ctx.createRadialGradient(width * 0.89, neb1Y, 30, width * 0.89, neb1Y, 700);
      if (isDark) {
        gradNeb1.addColorStop(0, "rgba(52, 211, 153, 0.25)");    // Radiant glowing emerald
        gradNeb1.addColorStop(0.35, "rgba(16, 185, 129, 0.14)"); // Luminous teal
        gradNeb1.addColorStop(0.65, "rgba(6, 182, 212, 0.07)");  // Cyan dispersion
        gradNeb1.addColorStop(1, "transparent");
      } else {
        gradNeb1.addColorStop(0, "rgba(16, 185, 129, 0.12)");
        gradNeb1.addColorStop(0.45, "rgba(14, 165, 233, 0.05)");
        gradNeb1.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNeb1;
      ctx.fillRect(0, 0, width, height);

      // 2. Deep Navy Blue Celestial Nebula (Backing Poseidon at top-left)
      const nebNavyY = 175 - smoothScrollY * 0.11 - breath1 * 0.6;
      const gradNebNavy = ctx.createRadialGradient(width * 0.11, nebNavyY, 20, width * 0.11, nebNavyY, 620);
      if (isDark) {
        gradNebNavy.addColorStop(0, "rgba(30, 58, 138, 0.32)");   // Rich deep navy blue core
        gradNebNavy.addColorStop(0.35, "rgba(37, 99, 235, 0.16)"); // Royal sapphire
        gradNebNavy.addColorStop(0.68, "rgba(14, 165, 233, 0.07)"); // Electric azure
        gradNebNavy.addColorStop(1, "transparent");
      } else {
        gradNebNavy.addColorStop(0, "rgba(30, 58, 138, 0.14)");
        gradNebNavy.addColorStop(0.45, "rgba(59, 130, 246, 0.06)");
        gradNebNavy.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNebNavy;
      ctx.fillRect(0, 0, width, height);

      // 3. Deep Sapphire/Indigo Void (Mid-scroll, lower-left)
      const neb2Y = 820 - smoothScrollY * 0.15 + breath2;
      const gradNeb2 = ctx.createRadialGradient(width * 0.10, neb2Y, 40, width * 0.10, neb2Y, 650);
      if (isDark) {
        gradNeb2.addColorStop(0, "rgba(59, 130, 246, 0.12)");
        gradNeb2.addColorStop(0.5, "rgba(99, 102, 241, 0.06)");
        gradNeb2.addColorStop(1, "transparent");
      } else {
        gradNeb2.addColorStop(0, "rgba(59, 130, 246, 0.06)");
        gradNeb2.addColorStop(0.5, "rgba(99, 102, 241, 0.03)");
        gradNeb2.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNeb2;
      ctx.fillRect(0, 0, width, height);

      // 4. Radiant Amber/Gold Nebula (Backing Solaria Prime at Projects)
      const nebSolY = 1320 - smoothScrollY * 0.14 + breath1 * 0.5;
      const gradNebSol = ctx.createRadialGradient(width * 0.88, nebSolY, 20, width * 0.88, nebSolY, 580);
      if (isDark) {
        gradNebSol.addColorStop(0, "rgba(245, 158, 11, 0.20)");   // Rich golden amber
        gradNebSol.addColorStop(0.35, "rgba(249, 115, 22, 0.10)"); // Warm coral
        gradNebSol.addColorStop(0.70, "rgba(217, 119, 6, 0.04)");  // Deep bronze
        gradNebSol.addColorStop(1, "transparent");
      } else {
        gradNebSol.addColorStop(0, "rgba(245, 158, 11, 0.09)");
        gradNebSol.addColorStop(0.45, "rgba(249, 115, 22, 0.03)");
        gradNebSol.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNebSol;
      ctx.fillRect(0, 0, width, height);

      // 5. Ultraviolet & Amethyst Nebula (Backing Vela Pulsar at Thinking)
      const nebVelY = 1780 - smoothScrollY * 0.14 - breath2 * 0.5;
      const gradNebVel = ctx.createRadialGradient(width * 0.12, nebVelY, 20, width * 0.12, nebVelY, 560);
      if (isDark) {
        gradNebVel.addColorStop(0, "rgba(168, 85, 247, 0.22)");   // Royal amethyst
        gradNebVel.addColorStop(0.35, "rgba(232, 121, 249, 0.10)"); // Vibrant magenta
        gradNebVel.addColorStop(0.70, "rgba(126, 34, 206, 0.04)");  // Deep violet
        gradNebVel.addColorStop(1, "transparent");
      } else {
        gradNebVel.addColorStop(0, "rgba(168, 85, 247, 0.08)");
        gradNebVel.addColorStop(0.45, "rgba(216, 180, 254, 0.03)");
        gradNebVel.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNebVel;
      ctx.fillRect(0, 0, width, height);

      // 6. Electric Cyan & Sapphire Cloud (Backing Neptis Core at Skills)
      const nebNepY = 2260 - smoothScrollY * 0.14 + breath1 * 0.4;
      const gradNebNep = ctx.createRadialGradient(width * 0.87, nebNepY, 20, width * 0.87, nebNepY, 600);
      if (isDark) {
        gradNebNep.addColorStop(0, "rgba(56, 189, 248, 0.20)");   // Electric cyan
        gradNebNep.addColorStop(0.35, "rgba(2, 132, 199, 0.10)");  // Royal sapphire
        gradNebNep.addColorStop(0.70, "rgba(3, 105, 161, 0.04)");  // Deep azure
        gradNebNep.addColorStop(1, "transparent");
      } else {
        gradNebNep.addColorStop(0, "rgba(56, 189, 248, 0.08)");
        gradNebNep.addColorStop(0.45, "rgba(2, 132, 199, 0.03)");
        gradNebNep.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNebNep;
      ctx.fillRect(0, 0, width, height);

      // 7. Radiant Coral & Ruby Glow (Backing Ares Gateway at Contact)
      const nebArY = 2750 - smoothScrollY * 0.14 - breath1 * 0.4;
      const gradNebAr = ctx.createRadialGradient(width * 0.11, nebArY, 20, width * 0.11, nebArY, 540);
      if (isDark) {
        gradNebAr.addColorStop(0, "rgba(251, 113, 133, 0.18)");   // Rose coral
        gradNebAr.addColorStop(0.35, "rgba(225, 29, 72, 0.09)");   // Ruby crimson
        gradNebAr.addColorStop(0.70, "rgba(159, 18, 57, 0.03)");   // Deep wine
        gradNebAr.addColorStop(1, "transparent");
      } else {
        gradNebAr.addColorStop(0, "rgba(251, 113, 133, 0.07)");
        gradNebAr.addColorStop(0.45, "rgba(244, 63, 94, 0.02)");
        gradNebAr.addColorStop(1, "transparent");
      }
      ctx.fillStyle = gradNebAr;
      ctx.fillRect(0, 0, width, height);

      // ----------------------------------------------------
      // B. 3D PARALLAX STARFIELD & WARP STREAKS
      // ----------------------------------------------------
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        const totalHeight = height * 3.4;
        let starY = (s.baseY - smoothScrollY * s.speed) % totalHeight;
        if (starY < -60) starY += totalHeight;
        if (starY > height + 60) starY -= totalHeight;

        let drawX = s.x;
        let drawY = starY;

        if (s.layer > 0) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - starY;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 1) {
            const pull = (1 - dist / mouse.radius) * (s.layer === 2 ? 14 : 7);
            drawX += (dx / dist) * pull;
            drawY += (dy / dist) * pull;
          }
        }

        const twinkle = Math.sin(frame * s.twinkleSpeed + s.twinklePhase);
        const currentAlpha = Math.max(0.12, s.baseAlpha + twinkle * 0.28);

        ctx.fillStyle = s.color;
        ctx.globalAlpha = currentAlpha;

        if (warpStretch > 2 && s.layer > 0) {
          ctx.strokeStyle = s.color;
          ctx.lineWidth = s.size * 0.85;
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX, drawY + warpStretch * s.speed * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.size, 0, Math.PI * 2);
          ctx.fill();

          if (s.hasSpikes && currentAlpha > 0.45) {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            const spikeLen = s.size * 3.6;
            ctx.moveTo(drawX - spikeLen, drawY);
            ctx.lineTo(drawX + spikeLen, drawY);
            ctx.moveTo(drawX, drawY - spikeLen);
            ctx.lineTo(drawX + spikeLen, drawY);
            ctx.stroke();
          }
        }
      }

      // ----------------------------------------------------
      // C. TINY COSMIC OBJECTS & NAVY BLUE MICRO-DEBRIS
      // ----------------------------------------------------
      for (let i = 0; i < microObjects.length; i++) {
        const mo = microObjects[i];
        mo.x += mo.driftX;
        mo.baseY += mo.driftY;
        mo.rotation += mo.rotSpeed;

        if (mo.x < -20) mo.x = width + 20;
        if (mo.x > width + 20) mo.x = -20;

        const totalH = height * 3.6;
        let objY = (mo.baseY - smoothScrollY * mo.scrollFactor) % totalH;
        if (objY < -40) objY += totalH;
        if (objY > height + 40) objY -= totalH;

        if (objY > -30 && objY < height + 30) {
          const pulse = Math.sin(frame * 0.03 + mo.pulsePhase) * 0.2;
          ctx.save();
          ctx.translate(mo.x, objY);
          ctx.rotate(mo.rotation);
          ctx.fillStyle = mo.color;
          ctx.globalAlpha = Math.max(0.18, mo.baseAlpha + pulse);

          if (mo.type === "dust") {
            ctx.beginPath();
            ctx.arc(0, 0, mo.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (mo.type === "prism") {
            // Crystalline micro-prism (diamond / triangle)
            ctx.beginPath();
            ctx.moveTo(0, -mo.size);
            ctx.lineTo(mo.size * 0.85, 0);
            ctx.lineTo(0, mo.size);
            ctx.lineTo(-mo.size * 0.85, 0);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.28)" : "rgba(30, 58, 138, 0.22)";
            ctx.lineWidth = 0.6;
            ctx.stroke();
          } else {
            // Tiny micro-probe or node
            ctx.fillRect(-mo.size * 0.5, -mo.size * 0.5, mo.size, mo.size);
            ctx.strokeStyle = isDark ? "#38BDF8" : "#1E40AF";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // D. DEEP SPACE TELEMETRY PROBES (TINY SATELLITES)
      // ----------------------------------------------------
      deepSpaceProbes.forEach((probe) => {
        probe.baseX += probe.vx * 0.05;
        probe.baseY += probe.vy * 0.05;
        probe.beaconPhase += 0.04;

        const prX = probe.baseX * width;
        const prY = probe.baseY - smoothScrollY * probe.scrollFactor;

        if (prY > -30 && prY < height + 30) {
          ctx.save();
          ctx.translate(prX, prY);

          // Central Probe Body
          ctx.fillStyle = isDark ? "#94A3B8" : "#475569";
          ctx.fillRect(-3, -3, 6, 6);

          // Navy Blue Solar Panels
          ctx.fillStyle = isDark ? "#1E3A8A" : "#1D4ED8";
          ctx.fillRect(-10, -2, 6, 4);
          ctx.fillRect(4, -2, 6, 4);

          ctx.strokeStyle = isDark ? "#60A5FA" : "#38BDF8";
          ctx.lineWidth = 0.6;
          ctx.strokeRect(-10, -2, 6, 4);
          ctx.strokeRect(4, -2, 6, 4);

          // Blinking LED Beacon
          const beaconBlink = (Math.sin(probe.beaconPhase) + 1) * 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(52, 211, 153, ${0.4 + beaconBlink * 0.6})` : `rgba(37, 99, 235, ${0.4 + beaconBlink * 0.6})`;
          ctx.shadowColor = isDark ? "#34D399" : "#2563EB";
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.restore();
        }
      });

      // ----------------------------------------------------
      // E. CELESTIAL 1: BRIGHT LUMINOUS RINGED PLANET ("CHRONOS")
      // ----------------------------------------------------
      const p1X = ringedPlanet.baseX * width;
      const p1Y = ringedPlanet.baseY - smoothScrollY * ringedPlanet.scrollFactor;

      // Celestial 1 is now dynamically rendered as an orbiting planet in HeroPlanets.jsx
      if (false && p1Y > -280 && p1Y < height + 280) {
        ctx.save();
        ctx.translate(p1X, p1Y);

        // 1. Radiant Atmospheric Corona (Boosted Brightness & Vibrance)
        const p1Glow = ctx.createRadialGradient(0, 0, ringedPlanet.radius * 0.35, 0, 0, ringedPlanet.radius * 3.4);
        if (isDark) {
          p1Glow.addColorStop(0, "rgba(52, 211, 153, 0.75)");    // Bright vivid emerald core
          p1Glow.addColorStop(0.28, "rgba(16, 185, 129, 0.45)"); // Vibrant teal aura
          p1Glow.addColorStop(0.60, "rgba(6, 182, 212, 0.20)");  // Luminous cyan halo
          p1Glow.addColorStop(1, "transparent");
        } else {
          p1Glow.addColorStop(0, "rgba(16, 185, 129, 0.42)");
          p1Glow.addColorStop(0.40, "rgba(10, 122, 95, 0.20)");
          p1Glow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = p1Glow;
        ctx.beginPath();
        ctx.arc(0, 0, ringedPlanet.radius * 3.4, 0, Math.PI * 2);
        ctx.fill();

        // 2. BACK HALF OF TILTED RINGS
        ctx.save();
        ctx.rotate(ringedPlanet.ringTilt);

        if (isDark) {
          ctx.shadowColor = "#34D399";
          ctx.shadowBlur = 24;
        }

        // Outer Ring Band
        ctx.beginPath();
        ctx.ellipse(0, 0, ringedPlanet.ringOuter, ringedPlanet.ringOuter * 0.28, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(110, 231, 183, 0.95)" : "rgba(10, 122, 95, 0.75)";
        ctx.lineWidth = 18;
        ctx.stroke();

        // Inner Concentric Ring Band
        ctx.beginPath();
        ctx.ellipse(0, 0, ringedPlanet.ringInner, ringedPlanet.ringInner * 0.28, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.85)" : "rgba(2, 132, 199, 0.65)";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. PLANET SPHERE WITH BRIGHT SPECULAR SHINE
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, ringedPlanet.radius, 0, Math.PI * 2);
        ctx.clip();

        // Luminous 3D sphere lighting (No pitch black terminator)
        const p1Grad = ctx.createRadialGradient(
          -ringedPlanet.radius * 0.38,
          -ringedPlanet.radius * 0.38,
          ringedPlanet.radius * 0.02,
          0,
          0,
          ringedPlanet.radius
        );
        if (isDark) {
          p1Grad.addColorStop(0, "#FFFFFF");     // Brilliant specular gleam
          p1Grad.addColorStop(0.12, "#A7F3D0");  // Glowing mint light
          p1Grad.addColorStop(0.35, "#34D399");  // Radiant emerald
          p1Grad.addColorStop(0.65, "#10B981");  // Rich vivid emerald
          p1Grad.addColorStop(0.88, "#047857");  // Deep emerald shade
          p1Grad.addColorStop(1, "#064E3B");     // Edge terminator
        } else {
          p1Grad.addColorStop(0, "#FFFFFF");
          p1Grad.addColorStop(0.20, "#A7F3D0");
          p1Grad.addColorStop(0.50, "#10B981");
          p1Grad.addColorStop(0.85, "#047857");
          p1Grad.addColorStop(1, "#064E3B");
        }
        ctx.fillStyle = p1Grad;
        ctx.fill();

        // Luminous Atmospheric Cloud Bands
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.35)";
        ctx.fillRect(-ringedPlanet.radius, -22, ringedPlanet.radius * 2, 11);
        ctx.fillRect(-ringedPlanet.radius, 10, ringedPlanet.radius * 2, 12);
        ctx.fillStyle = isDark ? "rgba(167, 243, 208, 0.22)" : "rgba(16, 185, 129, 0.18)";
        ctx.fillRect(-ringedPlanet.radius, -6, ringedPlanet.radius * 2, 8);

        // Ring Shadow across sphere
        ctx.save();
        ctx.rotate(ringedPlanet.ringTilt);
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.fillRect(-ringedPlanet.radius, -4, ringedPlanet.radius * 2, 8);
        ctx.restore();

        ctx.restore(); // end clip

        // 4. FRONT HALF OF TILTED RINGS
        ctx.save();
        ctx.rotate(ringedPlanet.ringTilt);

        if (isDark) {
          ctx.shadowColor = "#34D399";
          ctx.shadowBlur = 24;
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, ringedPlanet.ringOuter, ringedPlanet.ringOuter * 0.28, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(110, 231, 183, 0.95)" : "rgba(10, 122, 95, 0.75)";
        ctx.lineWidth = 18;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, ringedPlanet.ringInner, ringedPlanet.ringInner * 0.28, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.85)" : "rgba(2, 132, 199, 0.65)";
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();

        // 5. COMPANION MOON
        ringedPlanet.moon.angle += ringedPlanet.moon.speed;
        const mX = Math.cos(ringedPlanet.moon.angle) * ringedPlanet.moon.orbitA;
        const mY = Math.sin(ringedPlanet.moon.angle) * ringedPlanet.moon.orbitB;

        ctx.beginPath();
        ctx.arc(mX, mY, ringedPlanet.moon.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#FFFFFF" : "#475569";
        ctx.shadowColor = isDark ? "#34D399" : "rgba(10, 122, 95, 0.6)";
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // F. CELESTIAL 2: NAVY BLUE THEMED PLANET ("POSEIDON-PRIME")
      // ----------------------------------------------------
      // Positioned on the top-left to balance Chronos on top-right
      const pNavyX = navyPlanet.baseX * width;
      const pNavyY = navyPlanet.baseY - smoothScrollY * navyPlanet.scrollFactor;

      // Celestial 2 is now dynamically rendered as an orbiting planet in HeroPlanets.jsx
      if (false && pNavyY > -180 && pNavyY < height + 180) {
        ctx.save();
        ctx.translate(pNavyX, pNavyY);

        // 1. Navy Atmospheric Corona Glow
        const navyHalo = ctx.createRadialGradient(0, 0, navyPlanet.radius * 0.4, 0, 0, navyPlanet.radius * 2.8);
        if (isDark) {
          navyHalo.addColorStop(0, "rgba(37, 99, 235, 0.55)");   // Royal sapphire core
          navyHalo.addColorStop(0.35, "rgba(30, 58, 138, 0.30)"); // Deep navy
          navyHalo.addColorStop(0.70, "rgba(14, 165, 233, 0.12)"); // Electric azure
          navyHalo.addColorStop(1, "transparent");
        } else {
          navyHalo.addColorStop(0, "rgba(30, 58, 138, 0.25)");
          navyHalo.addColorStop(0.45, "rgba(59, 130, 246, 0.10)");
          navyHalo.addColorStop(1, "transparent");
        }
        ctx.fillStyle = navyHalo;
        ctx.beginPath();
        ctx.arc(0, 0, navyPlanet.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 2. Back Half of Delicate Ice Ring
        ctx.save();
        ctx.rotate(navyPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#3B82F6";
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, navyPlanet.ringOuter, navyPlanet.ringOuter * 0.24, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.65)" : "rgba(30, 58, 138, 0.45)";
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. Planet Sphere (Deep Navy 3D Shading)
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, navyPlanet.radius, 0, Math.PI * 2);
        ctx.clip();

        const pNavyGrad = ctx.createRadialGradient(
          -navyPlanet.radius * 0.35,
          -navyPlanet.radius * 0.35,
          navyPlanet.radius * 0.05,
          0,
          0,
          navyPlanet.radius
        );
        if (isDark) {
          pNavyGrad.addColorStop(0, "#E0F2FE");     // Ice-white specular glint
          pNavyGrad.addColorStop(0.18, "#60A5FA");  // Bright cerulean
          pNavyGrad.addColorStop(0.45, "#2563EB");  // Royal cobalt
          pNavyGrad.addColorStop(0.75, "#1E3A8A");  // Deep navy blue
          pNavyGrad.addColorStop(1, "#0F172A");     // Midnight slate terminator
        } else {
          pNavyGrad.addColorStop(0, "#FFFFFF");
          pNavyGrad.addColorStop(0.22, "#93C5FD");
          pNavyGrad.addColorStop(0.55, "#2563EB");
          pNavyGrad.addColorStop(0.85, "#1E3A8A");
          pNavyGrad.addColorStop(1, "#0F172A");
        }
        ctx.fillStyle = pNavyGrad;
        ctx.fill();

        // Swirling Azure / Navy Cloud Bands
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.30)";
        ctx.fillRect(-navyPlanet.radius, -12, navyPlanet.radius * 2, 7);
        ctx.fillRect(-navyPlanet.radius, 6, navyPlanet.radius * 2, 8);
        ctx.fillStyle = isDark ? "rgba(30, 58, 138, 0.35)" : "rgba(15, 23, 42, 0.15)";
        ctx.fillRect(-navyPlanet.radius, -2, navyPlanet.radius * 2, 6);

        ctx.restore(); // end clip

        // 4. Front Half of Delicate Ice Ring
        ctx.save();
        ctx.rotate(navyPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#3B82F6";
          ctx.shadowBlur = 14;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, navyPlanet.ringOuter, navyPlanet.ringOuter * 0.24, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.65)" : "rgba(30, 58, 138, 0.45)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 5. Tiny Orbiting Navy Ice Moon
        navyPlanet.moon.angle += navyPlanet.moon.speed;
        const nMoonX = Math.cos(navyPlanet.moon.angle) * navyPlanet.moon.orbitA;
        const nMoonY = Math.sin(navyPlanet.moon.angle) * navyPlanet.moon.orbitB;

        ctx.beginPath();
        ctx.arc(nMoonX, nMoonY, navyPlanet.moon.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#BAE6FD" : "#3B82F6";
        ctx.shadowColor = isDark ? "#38BDF8" : "rgba(30, 58, 138, 0.6)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // G. CELESTIAL 3: EMERALD WORLD ("VERACITY PRIME")
      // ----------------------------------------------------
      const p2X = terrestrialPlanet.baseX * width;
      const p2Y = terrestrialPlanet.baseY - smoothScrollY * terrestrialPlanet.scrollFactor;

      if (p2Y > -180 && p2Y < height + 180) {
        ctx.save();
        ctx.translate(p2X, p2Y);

        const p2Halo = ctx.createRadialGradient(0, 0, terrestrialPlanet.radius * 0.7, 0, 0, terrestrialPlanet.radius * 2.2);
        p2Halo.addColorStop(0, isDark ? "rgba(56, 189, 248, 0.40)" : "rgba(2, 132, 199, 0.22)");
        p2Halo.addColorStop(1, "transparent");
        ctx.fillStyle = p2Halo;
        ctx.beginPath();
        ctx.arc(0, 0, terrestrialPlanet.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, terrestrialPlanet.radius, 0, Math.PI * 2);
        const p2Grad = ctx.createRadialGradient(
          -terrestrialPlanet.radius * 0.35,
          -terrestrialPlanet.radius * 0.35,
          5,
          0,
          0,
          terrestrialPlanet.radius
        );
        if (isDark) {
          p2Grad.addColorStop(0, "#7DD3FC");
          p2Grad.addColorStop(0.35, "#0284C7");
          p2Grad.addColorStop(0.75, "#0F172A");
          p2Grad.addColorStop(1, "#020617");
        } else {
          p2Grad.addColorStop(0, "#BAE6FD");
          p2Grad.addColorStop(0.45, "#0284C7");
          p2Grad.addColorStop(1, "#0C4A6E");
        }
        ctx.fillStyle = p2Grad;
        ctx.fill();

        // Orbiting Satellite Beacon
        terrestrialPlanet.satellite.angle += terrestrialPlanet.satellite.speed;
        const satX = Math.cos(terrestrialPlanet.satellite.angle) * terrestrialPlanet.satellite.orbitA;
        const satY = Math.sin(terrestrialPlanet.satellite.angle) * terrestrialPlanet.satellite.orbitB;

        ctx.beginPath();
        ctx.ellipse(0, 0, terrestrialPlanet.satellite.orbitA, terrestrialPlanet.satellite.orbitB, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.22)" : "rgba(2, 132, 199, 0.18)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(satX, satY, terrestrialPlanet.satellite.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#10B981" : "#0A7A5F";
        ctx.shadowColor = isDark ? "#10B981" : "rgba(10, 122, 95, 0.6)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // H. CELESTIAL 4: GOLDEN GAS GIANT ("SOLARIA PRIME") - AT PROJECTS
      // ----------------------------------------------------
      const pSolX = solariaPlanet.baseX * width;
      const pSolY = solariaPlanet.baseY - smoothScrollY * solariaPlanet.scrollFactor;

      if (pSolY > -220 && pSolY < height + 220) {
        ctx.save();
        ctx.translate(pSolX, pSolY);

        // 1. Warm Amber Corona Glow
        const solHalo = ctx.createRadialGradient(0, 0, solariaPlanet.radius * 0.5, 0, 0, solariaPlanet.radius * 2.8);
        if (isDark) {
          solHalo.addColorStop(0, "rgba(245, 158, 11, 0.45)");
          solHalo.addColorStop(0.35, "rgba(249, 115, 22, 0.22)");
          solHalo.addColorStop(0.70, "rgba(253, 230, 138, 0.08)");
          solHalo.addColorStop(1, "transparent");
        } else {
          solHalo.addColorStop(0, "rgba(245, 158, 11, 0.20)");
          solHalo.addColorStop(0.45, "rgba(217, 119, 6, 0.08)");
          solHalo.addColorStop(1, "transparent");
        }
        ctx.fillStyle = solHalo;
        ctx.beginPath();
        ctx.arc(0, 0, solariaPlanet.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // 2. Back Half of Crystalline Ring
        ctx.save();
        ctx.rotate(solariaPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, solariaPlanet.ringOuter, solariaPlanet.ringOuter * 0.28, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(253, 230, 138, 0.65)" : "rgba(217, 119, 6, 0.45)";
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, solariaPlanet.ringInner, solariaPlanet.ringInner * 0.28, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.80)" : "rgba(180, 83, 9, 0.55)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. Planet Sphere (Molten Gold & Amber 3D Spherical Shading)
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, solariaPlanet.radius, 0, Math.PI * 2);
        ctx.clip();

        const solGrad = ctx.createRadialGradient(
          -solariaPlanet.radius * 0.35,
          -solariaPlanet.radius * 0.35,
          solariaPlanet.radius * 0.05,
          0,
          0,
          solariaPlanet.radius
        );
        if (isDark) {
          solGrad.addColorStop(0, "#FEF3C7"); // Specular golden glint
          solGrad.addColorStop(0.20, "#FCD34D"); // Bright topaz
          solGrad.addColorStop(0.50, "#F59E0B"); // Warm radiant amber
          solGrad.addColorStop(0.80, "#B45309"); // Deep bronze
          solGrad.addColorStop(1, "#1C1917"); // Dark terminator
        } else {
          solGrad.addColorStop(0, "#FFFFFF");
          solGrad.addColorStop(0.25, "#FDE68A");
          solGrad.addColorStop(0.55, "#F59E0B");
          solGrad.addColorStop(0.85, "#B45309");
          solGrad.addColorStop(1, "#292524");
        }
        ctx.fillStyle = solGrad;
        ctx.fill();

        // Planetary Atmospheric Gas Bands
        ctx.fillStyle = isDark ? "rgba(254, 243, 199, 0.28)" : "rgba(255, 255, 255, 0.35)";
        ctx.fillRect(-solariaPlanet.radius, -18, solariaPlanet.radius * 2, 8);
        ctx.fillRect(-solariaPlanet.radius, 10, solariaPlanet.radius * 2, 10);
        ctx.fillStyle = isDark ? "rgba(180, 83, 9, 0.40)" : "rgba(120, 53, 15, 0.25)";
        ctx.fillRect(-solariaPlanet.radius, -5, solariaPlanet.radius * 2, 8);
        ctx.fillRect(-solariaPlanet.radius, 24, solariaPlanet.radius * 2, 5);

        ctx.restore(); // end sphere clip

        // 4. Front Half of Crystalline Ring
        ctx.save();
        ctx.rotate(solariaPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#F59E0B";
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, solariaPlanet.ringOuter, solariaPlanet.ringOuter * 0.28, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(253, 230, 138, 0.65)" : "rgba(217, 119, 6, 0.45)";
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, solariaPlanet.ringInner, solariaPlanet.ringInner * 0.28, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.80)" : "rgba(180, 83, 9, 0.55)";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 5. Orbiting Molten Gold Moonlet
        solariaPlanet.moon.angle += solariaPlanet.moon.speed;
        const solMoonX = Math.cos(solariaPlanet.moon.angle) * solariaPlanet.moon.orbitA;
        const solMoonY = Math.sin(solariaPlanet.moon.angle) * solariaPlanet.moon.orbitB;

        ctx.beginPath();
        ctx.ellipse(0, 0, solariaPlanet.moon.orbitA, solariaPlanet.moon.orbitB, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.20)" : "rgba(217, 119, 6, 0.16)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(solMoonX, solMoonY, solariaPlanet.moon.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#FEF08A" : "#D97706";
        ctx.shadowColor = isDark ? "#F59E0B" : "rgba(217, 119, 6, 0.6)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // I. CELESTIAL 5: VELA PULSAR & MAGNETAR - AT HOW I THINK
      // ----------------------------------------------------
      const pVelX = velaPulsar.baseX * width;
      const pVelY = velaPulsar.baseY - smoothScrollY * velaPulsar.scrollFactor;

      if (pVelY > -240 && pVelY < height + 240) {
        ctx.save();
        ctx.translate(pVelX, pVelY);

        const jetWobble = Math.sin(frame * velaPulsar.jetWobbleSpeed) * 0.18;
        const curJetAngle = velaPulsar.jetAngle + jetWobble;

        // 1. Relativistic Bipolar Energetic Particle Jets (Shooting from magnetic poles)
        [-1, 1].forEach((dir) => {
          ctx.save();
          ctx.rotate(curJetAngle + (dir === -1 ? Math.PI : 0));

          const jetGrad = ctx.createLinearGradient(0, 0, 0, velaPulsar.jetLength);
          jetGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          jetGrad.addColorStop(0.18, "rgba(232, 121, 249, 0.75)"); // Electric magenta
          jetGrad.addColorStop(0.55, "rgba(168, 85, 247, 0.35)");  // Amethyst plasma
          jetGrad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.moveTo(-velaPulsar.radius * 0.25, 0);
          ctx.lineTo(velaPulsar.radius * 0.25, 0);
          ctx.lineTo(velaPulsar.radius * 0.65, velaPulsar.jetLength);
          ctx.lineTo(-velaPulsar.radius * 0.65, velaPulsar.jetLength);
          ctx.closePath();

          ctx.fillStyle = jetGrad;
          ctx.shadowColor = "#C084FC";
          ctx.shadowBlur = 16;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Filament Core Laser Ray
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, velaPulsar.jetLength * 1.15);
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(168, 85, 247, 0.65)";
          ctx.lineWidth = 1.8;
          ctx.stroke();

          ctx.restore();
        });

        // 2. High-Energy Violet Coronal Glow
        const velGlow = ctx.createRadialGradient(0, 0, velaPulsar.radius * 0.4, 0, 0, velaPulsar.radius * 3.2);
        if (isDark) {
          velGlow.addColorStop(0, "rgba(232, 121, 249, 0.55)");
          velGlow.addColorStop(0.35, "rgba(168, 85, 247, 0.30)");
          velGlow.addColorStop(0.70, "rgba(126, 34, 206, 0.10)");
          velGlow.addColorStop(1, "transparent");
        } else {
          velGlow.addColorStop(0, "rgba(168, 85, 247, 0.25)");
          velGlow.addColorStop(0.45, "rgba(147, 51, 234, 0.10)");
          velGlow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = velGlow;
        ctx.beginPath();
        ctx.arc(0, 0, velaPulsar.radius * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // 3. Rotating Particle Accretion Rings
        ctx.save();
        ctx.rotate(-0.45);
        ctx.beginPath();
        ctx.ellipse(0, 0, 68, 22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(232, 121, 249, 0.35)" : "rgba(168, 85, 247, 0.25)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        velaPulsar.accretionParticles.forEach((p) => {
          p.angle += p.speed;
          const px = Math.cos(p.angle) * p.dist;
          const py = Math.sin(p.angle) * (p.dist * 0.32);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        ctx.restore();

        // 4. Dense Neutron Star Core (Ultra-dense luminous spherical gradient)
        ctx.beginPath();
        ctx.arc(0, 0, velaPulsar.radius, 0, Math.PI * 2);
        const velCore = ctx.createRadialGradient(
          -velaPulsar.radius * 0.25,
          -velaPulsar.radius * 0.25,
          2,
          0,
          0,
          velaPulsar.radius
        );
        velCore.addColorStop(0, "#FFFFFF");
        velCore.addColorStop(0.25, "#F0ABFC");
        velCore.addColorStop(0.60, "#A855F7");
        velCore.addColorStop(0.90, "#6B21A8");
        velCore.addColorStop(1, "#3B0764");
        ctx.fillStyle = velCore;
        ctx.shadowColor = "#E879F9";
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // J. CELESTIAL 6: CYAN ICE GIANT ("NEPTIS CORE") - AT SKILLS & EXPERIENCE
      // ----------------------------------------------------
      const pNepX = neptisPlanet.baseX * width;
      const pNepY = neptisPlanet.baseY - smoothScrollY * neptisPlanet.scrollFactor;

      if (pNepY > -220 && pNepY < height + 220) {
        ctx.save();
        ctx.translate(pNepX, pNepY);

        // 1. Electric Cyan & Azure Corona
        const nepGlow = ctx.createRadialGradient(0, 0, neptisPlanet.radius * 0.5, 0, 0, neptisPlanet.radius * 2.7);
        if (isDark) {
          nepGlow.addColorStop(0, "rgba(56, 189, 248, 0.45)");
          nepGlow.addColorStop(0.40, "rgba(2, 132, 199, 0.22)");
          nepGlow.addColorStop(0.75, "rgba(14, 165, 233, 0.08)");
          nepGlow.addColorStop(1, "transparent");
        } else {
          nepGlow.addColorStop(0, "rgba(56, 189, 248, 0.22)");
          nepGlow.addColorStop(0.45, "rgba(2, 132, 199, 0.08)");
          nepGlow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = nepGlow;
        ctx.beginPath();
        ctx.arc(0, 0, neptisPlanet.radius * 2.7, 0, Math.PI * 2);
        ctx.fill();

        // 2. Back Half of Concentric Ice Rings
        ctx.save();
        ctx.rotate(neptisPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#38BDF8";
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.ringOuter, neptisPlanet.ringOuter * 0.22, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(186, 230, 253, 0.55)" : "rgba(2, 132, 199, 0.35)";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.ringInner, neptisPlanet.ringInner * 0.22, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.65)" : "rgba(3, 105, 161, 0.45)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 3. Planet Sphere (3D Glacial Shading)
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, neptisPlanet.radius, 0, Math.PI * 2);
        ctx.clip();

        const nepGrad = ctx.createRadialGradient(
          -neptisPlanet.radius * 0.35,
          -neptisPlanet.radius * 0.35,
          neptisPlanet.radius * 0.05,
          0,
          0,
          neptisPlanet.radius
        );
        if (isDark) {
          nepGrad.addColorStop(0, "#F0F9FF"); // Glacial highlight
          nepGrad.addColorStop(0.22, "#7DD3FC"); // Bright cyan
          nepGrad.addColorStop(0.52, "#0284C7"); // Royal azure
          nepGrad.addColorStop(0.82, "#075985"); // Deep ocean
          nepGrad.addColorStop(1, "#082F49"); // Midnight abyss
        } else {
          nepGrad.addColorStop(0, "#FFFFFF");
          nepGrad.addColorStop(0.25, "#BAE6FD");
          nepGrad.addColorStop(0.55, "#0284C7");
          nepGrad.addColorStop(0.85, "#0369A1");
          nepGrad.addColorStop(1, "#082F49");
        }
        ctx.fillStyle = nepGrad;
        ctx.fill();

        // Methane Ice Cloud Stripes
        ctx.fillStyle = isDark ? "rgba(240, 249, 255, 0.24)" : "rgba(255, 255, 255, 0.35)";
        ctx.fillRect(-neptisPlanet.radius, -14, neptisPlanet.radius * 2, 6);
        ctx.fillRect(-neptisPlanet.radius, 8, neptisPlanet.radius * 2, 7);
        ctx.fillStyle = isDark ? "rgba(3, 105, 161, 0.35)" : "rgba(12, 74, 110, 0.20)";
        ctx.fillRect(-neptisPlanet.radius, -2, neptisPlanet.radius * 2, 5);

        ctx.restore(); // end sphere clip

        // 4. Front Half of Concentric Ice Rings
        ctx.save();
        ctx.rotate(neptisPlanet.ringTilt);
        if (isDark) {
          ctx.shadowColor = "#38BDF8";
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.ringOuter, neptisPlanet.ringOuter * 0.22, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(186, 230, 253, 0.55)" : "rgba(2, 132, 199, 0.35)";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.ringInner, neptisPlanet.ringInner * 0.22, 0, 0, Math.PI);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.65)" : "rgba(3, 105, 161, 0.45)";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 5. Dual Orbiting Moonlets
        // Moon 1 (Major Moonlet)
        neptisPlanet.moon1.angle += neptisPlanet.moon1.speed;
        const m1X = Math.cos(neptisPlanet.moon1.angle) * neptisPlanet.moon1.orbitA;
        const m1Y = Math.sin(neptisPlanet.moon1.angle) * neptisPlanet.moon1.orbitB;

        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.moon1.orbitA, neptisPlanet.moon1.orbitB, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(56, 189, 248, 0.18)" : "rgba(2, 132, 199, 0.14)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(m1X, m1Y, neptisPlanet.moon1.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#BAE6FD" : "#0284C7";
        ctx.shadowColor = isDark ? "#38BDF8" : "rgba(2, 132, 199, 0.5)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Moon 2 (Fast Outer Moonlet)
        neptisPlanet.moon2.angle += neptisPlanet.moon2.speed;
        const m2X = Math.cos(neptisPlanet.moon2.angle) * neptisPlanet.moon2.orbitA;
        const m2Y = Math.sin(neptisPlanet.moon2.angle) * neptisPlanet.moon2.orbitB;

        ctx.beginPath();
        ctx.ellipse(0, 0, neptisPlanet.moon2.orbitA, neptisPlanet.moon2.orbitB, 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(147, 197, 253, 0.14)" : "rgba(30, 64, 175, 0.10)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(m2X, m2Y, neptisPlanet.moon2.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#E0F2FE" : "#1D4ED8";
        ctx.shadowColor = isDark ? "#60A5FA" : "rgba(37, 99, 235, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // ----------------------------------------------------
      // K. CELESTIAL 7: ACCRETION SINGULARITY ("CYGNUS-X1")
      // ----------------------------------------------------
      const bhX = blackHole.baseX * width;
      const bhY = blackHole.baseY - smoothScrollY * blackHole.scrollFactor;

      if (bhY > -200 && bhY < height + 200) {
        ctx.save();
        ctx.translate(bhX, bhY);
        blackHole.rotation += 0.012;

        ctx.save();
        ctx.rotate(blackHole.diskTilt);

        const diskGlow = ctx.createRadialGradient(0, 0, blackHole.diskInner, 0, 0, blackHole.diskOuter);
        diskGlow.addColorStop(0, "rgba(245, 158, 11, 0.65)");
        diskGlow.addColorStop(0.35, "rgba(239, 68, 68, 0.35)");
        diskGlow.addColorStop(0.70, "rgba(56, 189, 248, 0.35)"); // Electric cyan aura in outer disk
        diskGlow.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.ellipse(0, 0, blackHole.diskOuter, blackHole.diskOuter * 0.35, 0, 0, Math.PI * 2);
        ctx.fillStyle = diskGlow;
        ctx.fill();

        blackHole.accretionParticles.forEach((p) => {
          p.angle += p.speed;
          const px = Math.cos(p.angle) * p.dist;
          const py = Math.sin(p.angle) * (p.dist * 0.35);

          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        ctx.restore();

        // Photon Ring
        ctx.beginPath();
        ctx.arc(0, 0, blackHole.photonRingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "#FFFFFF" : "#FCD34D";
        ctx.shadowColor = "#F59E0B";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Event Horizon
        ctx.beginPath();
        ctx.arc(0, 0, blackHole.eventHorizonRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();

        ctx.restore();
      }

      // ----------------------------------------------------
      // L. CELESTIAL 8: CORAL & RUBY WORLD ("ARES GATEWAY") - AT CONTACT & FOOTER
      // ----------------------------------------------------
      const pArX = aresPlanet.baseX * width;
      const pArY = aresPlanet.baseY - smoothScrollY * aresPlanet.scrollFactor;

      if (pArY > -200 && pArY < height + 200) {
        ctx.save();
        ctx.translate(pArX, pArY);

        // 1. Ruby & Coral Atmospheric Halo
        const arGlow = ctx.createRadialGradient(0, 0, aresPlanet.radius * 0.6, 0, 0, aresPlanet.radius * 2.6);
        if (isDark) {
          arGlow.addColorStop(0, "rgba(251, 113, 133, 0.40)");
          arGlow.addColorStop(0.40, "rgba(225, 29, 72, 0.20)");
          arGlow.addColorStop(0.75, "rgba(159, 18, 57, 0.06)");
          arGlow.addColorStop(1, "transparent");
        } else {
          arGlow.addColorStop(0, "rgba(251, 113, 133, 0.18)");
          arGlow.addColorStop(0.45, "rgba(225, 29, 72, 0.06)");
          arGlow.addColorStop(1, "transparent");
        }
        ctx.fillStyle = arGlow;
        ctx.beginPath();
        ctx.arc(0, 0, aresPlanet.radius * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // 2. Planet Sphere (Coral / Ruby 3D Lighting)
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, aresPlanet.radius, 0, Math.PI * 2);
        ctx.clip();

        const arGrad = ctx.createRadialGradient(
          -aresPlanet.radius * 0.35,
          -aresPlanet.radius * 0.35,
          aresPlanet.radius * 0.05,
          0,
          0,
          aresPlanet.radius
        );
        if (isDark) {
          arGrad.addColorStop(0, "#FFF1F2"); // Soft rose highlight
          arGrad.addColorStop(0.22, "#FB7185"); // Vibrant coral
          arGrad.addColorStop(0.55, "#E11D48"); // Deep ruby crimson
          arGrad.addColorStop(0.85, "#9F1239"); // Wine shadow
          arGrad.addColorStop(1, "#1C1917"); // Dark terminator
        } else {
          arGrad.addColorStop(0, "#FFFFFF");
          arGrad.addColorStop(0.25, "#FECDD3");
          arGrad.addColorStop(0.55, "#E11D48");
          arGrad.addColorStop(0.85, "#9F1239");
          arGrad.addColorStop(1, "#292524");
        }
        ctx.fillStyle = arGrad;
        ctx.fill();

        // Craters & Highland Ridges
        ctx.fillStyle = isDark ? "rgba(159, 18, 57, 0.35)" : "rgba(136, 19, 55, 0.20)";
        ctx.beginPath();
        ctx.arc(-12, -8, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(14, 12, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // end sphere clip

        // 3. Orbiting Dyson Swarm / Orbital Satellite Relay Array
        ctx.save();
        ctx.rotate(aresPlanet.dysonTilt);

        // Orbital Ring Track
        ctx.beginPath();
        ctx.ellipse(0, 0, aresPlanet.dysonOrbitA, aresPlanet.dysonOrbitB, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(251, 113, 133, 0.25)" : "rgba(225, 29, 72, 0.18)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting Satellite Nodes with Solar Wings & Telemetry LED
        aresPlanet.nodes.forEach((node) => {
          node.angle += node.speed;
          node.phase += 0.05;
          const nx = Math.cos(node.angle) * aresPlanet.dysonOrbitA;
          const ny = Math.sin(node.angle) * aresPlanet.dysonOrbitB;

          // Solar Wings
          ctx.save();
          ctx.translate(nx, ny);
          ctx.fillStyle = isDark ? "rgba(56, 189, 248, 0.85)" : "rgba(2, 132, 199, 0.75)";
          ctx.fillRect(-6, -1.5, 4, 3);
          ctx.fillRect(2, -1.5, 4, 3);

          // Central Avionics Bus
          ctx.fillStyle = isDark ? "#FFFFFF" : "#1E293B";
          ctx.fillRect(-2, -2, 4, 4);

          // Telemetry Beacon LED
          const beaconPulse = Math.sin(node.phase) > 0.4 ? 1 : 0.2;
          ctx.beginPath();
          ctx.arc(0, 0, 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? `rgba(52, 211, 153, ${beaconPulse})` : `rgba(16, 185, 129, ${beaconPulse})`;
          ctx.shadowColor = "#34D399";
          ctx.shadowBlur = 8 * beaconPulse;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.restore();
        });

        ctx.restore();

        ctx.restore();
      }

      // ----------------------------------------------------
      // I. SUBTLE FLOATING ASTEROIDS
      // ----------------------------------------------------
      for (let i = 0; i < asteroids.length; i++) {
        const ast = asteroids[i];
        const aY = ast.baseY - smoothScrollY * ast.scrollFactor;

        if (aY > -50 && aY < height + 50) {
          ast.rotation += ast.rotSpeed;

          ctx.save();
          ctx.translate(ast.baseX, aY);
          ctx.rotate(ast.rotation);

          ctx.beginPath();
          ast.vertices.forEach((v, idx) => {
            if (idx === 0) ctx.moveTo(v.x, v.y);
            else ctx.lineTo(v.x, v.y);
          });
          ctx.closePath();

          ctx.fillStyle = ast.color;
          ctx.globalAlpha = ast.alpha;
          ctx.fill();

          ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.22)" : "rgba(30, 58, 138, 0.16)";
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // J. SCROLL-COUPLED & AMBIENT SHOOTING METEORS
      // ----------------------------------------------------
      ambientCometTimer--;
      if (ambientCometTimer <= 0 && Math.random() < 0.035) {
        spawnMeteor(false);
        ambientCometTimer = Math.floor(Math.random() * 150) + 110;
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.alpha -= c.decay;

        if (c.alpha <= 0 || c.x < -150 || c.x > width + 250 || c.y > height + 250) {
          comets.splice(i, 1);
          continue;
        }

        const norm = Math.hypot(c.vx, c.vy) || 1;
        const tailX = c.x - (c.vx / norm) * c.length;
        const tailY = c.y - (c.vy / norm) * c.length;

        const cometGrad = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        cometGrad.addColorStop(0, c.colorHead);
        cometGrad.addColorStop(0.25, c.colorMid);
        cometGrad.addColorStop(0.70, c.colorTail);
        cometGrad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = cometGrad;
        ctx.lineWidth = c.isScrollTriggered ? 2.8 : 2.0;
        ctx.globalAlpha = c.alpha;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.isScrollTriggered ? 3.0 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = c.alpha;
        ctx.fill();
      }

      // ----------------------------------------------------
      // K. GRAVITATIONAL SHOCKWAVES
      // ----------------------------------------------------
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 5.5;
        sw.alpha -= 0.014;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.65)" : "rgba(30, 58, 138, 0.55)"; // Navy blue ripple
        ctx.lineWidth = 2;
        ctx.globalAlpha = sw.alpha;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("click", handleClick);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
      />
    </div>
  );
}
