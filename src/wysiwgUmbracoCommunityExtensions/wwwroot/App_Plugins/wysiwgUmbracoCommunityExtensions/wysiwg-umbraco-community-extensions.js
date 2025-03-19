const n = [
  {
    name: "wysiwgUmbraco Community Extensions Entrypoint",
    alias: "wysiwgUmbracoCommunityExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-DSMG6apb.js")
  }
], a = [
  {
    name: "wysiwgUmbraco Community Extensions Dashboard",
    alias: "wysiwgUmbracoCommunityExtensions.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-CEUF3Kiw.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
], o = [
  ...n,
  ...a
];
export {
  o as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
