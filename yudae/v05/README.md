# Yudae Commons v0.5 — review prototype

A new focused courtyard scene. The earlier v0.4.1 town remains at ../index.html.

## Implemented
- Procedural open-front clinic, Commons and dispatch shelter, with labelled equipment, logger trace, transfer case, route slate, contact folder, repaired cable and unverified solar controller.
- Six evidence objects with observation, epistemic limit, character account and consequential possibility.
- Shared state for screen and immersive AR. Investigation can reveal a transfer check and two competing volunteer tasks.
- Live changes to logger, radio, route slate, public notice, contact folder, charger tag and animated active power lead.
- Revisable allocations, two communication approaches, local reflection and path history.
- Equivalent object-map interactions when WebGL fails. Map mode is not labelled as 3D or AR.
- WebXR immersive-ar with required hit-test and DOM overlay, surface placement, repositioning, centre-ray object picking, number controls and decisions in camera view. Requires HTTPS and device/browser support. A capability check is not a successful device test.

## Limits and validation
This is a review prototype, not a validated educational intervention. Outcomes are authored fiction, not predictions. The battery interval is a narrative estimate, not a timer or equipment specification. The open-front architecture is a viewing convention.

Pure-state tests cover all six allocation/communication combinations, option prerequisites, exclusive volunteer tasks, revision, restoration and persistence data validation. Source syntax is checked. Physical-device AR tracking, placement, permissions and in-camera usability remain unverified. The available cloud browser cannot create a WebGL context; it can verify fallback UI and interactions, not rendering quality. No claim of universal iPhone/Android compatibility is made.

The old native AR model viewer is separate and displays the earlier town. It does not reproduce this new courtyard's interactions. This prototype uses runtime WebXR capability detection rather than user-agent promises.

## Architecture
engine.mjs: state, evidence and authored consequences; no browser or rendering dependency.
world.mjs: shared Three.js geometry, readable labels, dynamic scene state; static geometry batched by material.
spatial.mjs: screen camera, object selection, WebXR placement and session lifecycle.
app.mjs: accessible controls, local persistence, reflection and recovery.

Three.js is pinned to 0.180.0 through an import map. The main scenario loads independently of the renderer. No telemetry or server-side submission.

## Device acceptance checks still required
1. On-screen: view all six labels, inspect each object, zoom and return to whole courtyard at phone and desktop sizes.
2. Connect each service and compare the physical indicators with the consequence text.
3. In compatible phone AR: allow the requested session, find a surface, place, walk around, investigate, decide, reposition, exit and re-enter.
4. Deny camera/session permission; verify the path and on-screen controls survive.
5. Test long text, larger text settings, keyboard access and the equivalent object map.

References: https://codelabs.developers.google.com/ar-with-webxr ; https://threejs.org/docs/ ; https://github.com/immersive-web/dom-overlays
