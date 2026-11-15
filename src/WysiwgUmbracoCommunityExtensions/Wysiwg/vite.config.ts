import { defineConfig, type Plugin } from "vite";
import { readFileSync, writeFileSync } from 'fs';

function getPackageVersion(): string {
  const packageJsonPath = "./package.json";
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.version || "1.0.0";
}

function addRandomQueryParamToUmbracoPackage(mode: string): Plugin {
  return {
    name: "add-random-query-param-to-umbraco-package",
    generateBundle(_, bundle) { },
    writeBundle(_, bundle) {
      const version = getPackageVersion();
      const sourcePath = "./public/umbraco-package.json";
      const distPath = "../wwwroot/App_Plugins/WysiwgUmbracoCommunityExtensions/umbraco-package.json";
      const json = JSON.parse(readFileSync(sourcePath, 'utf-8'));
      json.version = version;

      for (const ext of json.extensions || []) {
        if (ext.js) {
          const random = Math.random().toString(36).substring(2, 8);
          const param = mode === "development" ? `v=${version}-${random}` : `v=${version}`;
          ext.js = `${ext.js.replace(/\?v=.*$/, '')}?${param}`;
        }
      }

      writeFileSync(distPath, JSON.stringify(json, null, 2));
    }
  }
}

export default defineConfig(({ mode }) => {
  return {
    build: {
      lib: {
        entry: "src/bundle.manifests.ts", // Bundle registers one or more manifests
        formats: ["es"],
        fileName: "wysiwg-umbraco-community-extensions",
      },
      outDir: "../wwwroot/App_Plugins/WysiwgUmbracoCommunityExtensions", // your web component will be saved in this location
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        external: [/^@umbraco/],
      },
    },
    plugins: [addRandomQueryParamToUmbracoPackage(mode)],
  }
});
