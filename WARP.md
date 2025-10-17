# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

- Serve locally (recommended for development):
  ```bash path=null start=null
  # Python
  python -m http.server 8000
  # Node.js (no install needed)
  npx http-server -p 8000
  # PHP
  php -S localhost:8000
  ```
  Then open http://localhost:8000

- Open directly (no server):
  ```bash path=null start=null
  # Open the file in a browser
  ./index.html
  ```

- Build: Not applicable (static HTML + CDN Three.js; no build step).
- Lint: Not configured.
- Tests: Not configured (no test suite or runner). Running a single test is not applicable.

## High-level architecture

- Single-file app: All HTML, CSS, and JavaScript live in index.html. Three.js r128 is loaded from a CDN; there is no package manager or bundler.
- Scene setup: Creates a THREE.Scene, PerspectiveCamera, and WebGLRenderer; appends canvas to body; handles window resize to keep aspect ratio.
- Background stars: Procedurally generates 10,000 points via BufferGeometry + PointsMaterial to form a starfield.
- Solar model:
  - Sun: Emissive sphere mesh at origin with a PointLight plus AmbientLight for general illumination.
  - Planets: Defined by a planetsData array [name, radius, color, orbitRadius, revolutionSpeed, rotationSpeed]. For each planet:
    - Orbit: Rendered as a circular Line (BufferGeometry) for visual trajectory.
    - Revolution: Each planet mesh is parented to an Object3D container; animation updates container.rotation.y by revolutionSpeed.
    - Rotation: Each planet mesh rotates around its Y axis by rotationSpeed.
    - Saturn adds a ring (RingGeometry) oriented in XZ-plane.
- Camera and controls: Manual orbital control implemented without OrbitControls. Mouse drag updates spherical angles (theta, phi); wheel adjusts cameraDistance with clamping; camera position recalculated each frame to lookAt origin.
- Animation loop: requestAnimationFrame-driven animate() updates camera, spins the sun slightly, advances each planet’s rotation/revolution, and renders the scene.

## Notes from README

- Usage: open index.html directly or serve via a local server (see Commands).
- Planet parameters are relative for visual effect and not to real-world scale.
- Tech stack: Three.js (r128), HTML5, CSS3, JavaScript.
