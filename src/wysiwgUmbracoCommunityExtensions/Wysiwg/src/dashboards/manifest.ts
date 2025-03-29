export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Block Demo Extensions Dashboard",
    alias: "BlockDemoExtensions.Dashboard",
    type: 'dashboard',
    js: () => import("./dashboard.element"),
    meta: {
      label: "WYSIWG Dashboard",
      pathname: "wysiwg-dashboard"
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Settings',
      }
    ],
  }
];
