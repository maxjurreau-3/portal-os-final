// src/modules/xr/index.js

import { EventBus } from "../../runtime/event-bus";

const XR_ENGINE_ID = "xr";
const XR_ENGINE_LABEL = "XR";

let xrScenes = [];
let activeXRScene = null;

function createSceneObject(name) {
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    objects: []
  };
}

export function createXRScene(name) {
  const scene = createSceneObject(name);
  xrScenes.push(scene);

  EventBus.emit("xr:sceneCreated", { scene });
  return scene;
}

export function listXRScenes() {
  return xrScenes;
}

export function getActiveXRScene() {
  return activeXRScene;
}

export function activateXRScene(sceneId) {
  const found = xrScenes.find(s => s.id === sceneId);
  if (!found) return null;

  activeXRScene = found;
  EventBus.emit("xr:sceneActivated", { scene: found });

  return found;
}

export function xrInteract(type, payload = {}) {
  if (!activeXRScene) {
    throw new Error("No active XR scene to interact with.");
  }

  EventBus.emit("xr:interaction", {
    scene: activeXRScene,
    type,
    payload
  });
}

export const xrCreateScene = createXRScene;
export const xrListScenes = listXRScenes;
export const xrGetActiveScene = getActiveXRScene;
export const xrSwitchScene = activateXRScene;
export const xrInteractWithScene = xrInteract;

export const XRRenderer = {
  id: XR_ENGINE_ID,
  label: XR_ENGINE_LABEL,
  icon: "🕶️",
  render() {
    const active = getActiveXRScene();
    return `
      <div class="xr-engine">
        <h2>XR Engine</h2>
        <p>Active Scene: ${active ? active.name : "None"}</p>
        <p>Total Scenes: ${xrScenes.length}</p>
      </div>
    `;
  }
};

const XREngine = {
  id: XR_ENGINE_ID,
  label: XR_ENGINE_LABEL,
  createXRScene,
  listXRScenes,
  getActiveXRScene,
  activateXRScene,
  xrInteract,
  aliases: {
    xrCreateScene,
    xrListScenes,
    xrGetActiveScene,
    xrSwitchScene,
    xrInteractWithScene
  },
  renderer: XRRenderer
};

export default XREngine;
