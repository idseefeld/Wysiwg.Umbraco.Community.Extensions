import { manifests as componentsManifests } from "./components/manifests.js";
import { manifests as viewsManifests } from "./views/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...componentsManifests,
  ...viewsManifests
];
