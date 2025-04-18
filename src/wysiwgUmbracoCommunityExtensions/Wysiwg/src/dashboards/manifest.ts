export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "WYSIWG Extensions Dashboard",
    alias: "WysiwgDashboardElement.Dashboard",
    type: 'dashboard',
    js: () => import('./dashboard.element.js'),
    meta: {
      label: "WYSIWG",
      pathname: "wysiwg-dashboard"
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Packages',
      }
    ],
  }
];
