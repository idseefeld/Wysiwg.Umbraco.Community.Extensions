import { UMB_WORKSPACE_CONDITION_ALIAS } from '@umbraco-cms/backoffice/workspace';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'workspaceContext',
    alias: 'Wysiwg.WorkspaceContext.BlockGrid',
    name: 'Wysiwg BlockGrid Context',
    api: () => import('./wysiwg.workspace.context.js'),
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: 'Umb.Workspace.Document',
      }
    ],
  }
];
