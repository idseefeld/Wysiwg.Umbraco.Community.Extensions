import { manifests as entrypoints } from "./entrypoints/manifest";
import { manifests as dashboards } from "./dashboards/manifest";
import { manifests as blocksManifests } from "./blocks/manifests.js";
import { manifests as propertyEditorsManifests } from "./property-editors/manifests.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  ...dashboards,
  ...blocksManifests,
  ...propertyEditorsManifests,
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.EnUS",
    "name": "English (United States)",
    "meta": {
      "culture": "en-us"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en-us.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.EnGB",
    "name": "English (United Kingdom)",
    "meta": {
      "culture": "en-gb"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en-gb.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.DeDE",
    "name": "German (Germany)",
    "meta": {
      "culture": "de-de"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/de-de.js"
  }
];
