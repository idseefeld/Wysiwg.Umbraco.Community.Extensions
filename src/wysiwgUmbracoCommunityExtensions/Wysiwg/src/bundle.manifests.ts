import { manifests as entrypoints } from "./entrypoints/manifest";
import { manifest as dashboard } from "./dashboards/manifest";
import { manifests as blocksManifests } from "./blocks/manifests.js";
import { manifests as propertyEditorsManifests } from "./property-editors/manifests.js";
import { manifests as localizationManifests } from "./localization.manifests.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  dashboard,
  ...blocksManifests,
  ...propertyEditorsManifests,
  ...localizationManifests,
];
