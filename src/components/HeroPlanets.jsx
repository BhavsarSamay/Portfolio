import React from "react";

/**
 * HeroPlanets Component
 * Orbiting celestial bodies (Chronos & Poseidon-Prime) revolving around
 * a central gravitational anchor point using CSS keyframe orbits and
 * synchronous counter-rotation to keep rings and lighting orientation fixed.
 */
export default function HeroPlanets() {
  return (
    <div className="hero-orbit-system pointer-events-none" aria-hidden="true">
      {/* Central Gravitational Anchor Point */}
      <div className="gravitational-anchor">
        {/* Central Cosmic Sun / Gravitational Core */}
        <div className="central-sun">
          <div className="central-sun-corona" />
          <div className="central-sun-core" />
        </div>

        {/* Orbit Track & Orbit Container: Blue Planet (Top-Left Origin, Tighter Radius, 30s Speed) */}
        <div className="orbit-container orbit-blue">
          <div className="planet-offset planet-blue-offset">
            <div className="planet-image planet-blue-image" title="Poseidon-Prime (Blue Ice Giant)">
              {/* Sapphire Atmospheric Corona Glow */}
              <div className="planet-corona planet-blue-corona" />
              {/* Back Half of Ice Ring (Depth Layer 1) */}
              <div className="planet-blue-ring-back" />
              {/* 3D Shaded Planet Sphere Body */}
              <div className="planet-blue-sphere">
                <div className="planet-blue-texture" />
              </div>
              {/* Front Half of Ice Ring (Depth Layer 3) */}
              <div className="planet-blue-ring-front" />
              {/* Orbiting Ice Moon */}
              <div className="planet-blue-moon" />
            </div>
          </div>
        </div>

        {/* Orbit Track & Orbit Container: Green Planet (Top-Right Origin, Wider Radius, 60s Speed) */}
        <div className="orbit-container orbit-green">
          <div className="planet-offset planet-green-offset">
            <div className="planet-image planet-green-image" title="Chronos (Emerald Ringed Giant)">
              {/* Emerald Atmospheric Corona Glow */}
              <div className="planet-corona planet-green-corona" />
              {/* Back Half of Ring (Depth Layer 1) */}
              <div className="planet-green-ring-back" />
              {/* 3D Shaded Planet Sphere Body */}
              <div className="planet-green-sphere">
                <div className="planet-green-texture" />
              </div>
              {/* Front Half of Ring (Depth Layer 3) */}
              <div className="planet-green-ring-front" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
