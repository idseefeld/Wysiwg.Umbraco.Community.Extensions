export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "wysiwgUmbraco Community Extensions Entrypoint",
    alias: "wysiwgUmbracoCommunityExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint"),
  }
];
