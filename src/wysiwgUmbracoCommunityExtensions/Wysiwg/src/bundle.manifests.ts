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
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.En",
    "name": "English",
    "meta": {
      "culture": "en"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.EnGB",
    "name": "English (UK)",
    "meta": {
      "culture": "en-gb"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.EnUS",
    "name": "English (US)",
    "meta": {
      "culture": "en-us"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.DeDE",
    "name": "German (Germany)",
    "meta": {
      "culture": "de-de"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/de.js"
  },
  {
    "type": "localization",
    "alias": "WysiwgUmbracoCommunityExtensions.Localize.DeCH",
    "name": "German (Switzerland)",
    "meta": {
      "culture": "de-ch"
    },
    "js": "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/de.js"
  }
];
