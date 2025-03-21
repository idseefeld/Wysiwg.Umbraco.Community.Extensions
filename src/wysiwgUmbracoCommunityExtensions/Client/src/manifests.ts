import { manifests as blocksManifests } from "./blocks/manifests.js";
import { manifests as propertyEditorsManifests } from "./property-editors/manifests.js";
import { manifests as dashboardManifests } from "./dashboards/manifest.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...blocksManifests,
  ...propertyEditorsManifests,
  ...dashboardManifests
];
