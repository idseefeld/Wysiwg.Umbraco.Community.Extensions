import { ManifestGlobalContext } from "@umbraco-cms/backoffice/extension-registry";

export const manifests: Array<ManifestGlobalContext> = [
  {
    type: 'globalContext',
    alias: 'Wysiwg.GlobalContext.BlockGrid',
    name: 'Wysiwg BlockGrid Context',
    api: () => import('./wysiwg.context.js')
  }
];
