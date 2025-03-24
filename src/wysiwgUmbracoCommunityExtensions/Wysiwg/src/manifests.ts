import { manifests as blocksManifests } from "./blocks/manifests.js";
import { manifests as propertyEditorsManifests } from "./property-editors/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...blocksManifests,
  ...propertyEditorsManifests
];
