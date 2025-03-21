export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Block Demo Extensions Dashboard",
    alias: "WysiwgUmbracoCommunityExtensions.Dashboard",
    type: 'dashboard',
    js: () => import("./dashboard.element"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Content',
      }
    ],
  }
];
