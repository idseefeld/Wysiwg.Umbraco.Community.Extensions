
import { WYSIWG_DOCUMENT_ITEM_REPOSITORY_ALIAS, WYSIWG_DOCUMENT_STORE_ALIAS } from './constants';
import { WysiwgRepository } from './wysiwg.repository';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'repository',
    alias: WYSIWG_DOCUMENT_ITEM_REPOSITORY_ALIAS,
    name: 'Wysiwg Repository',
    api: WysiwgRepository,
  },
  {
    type: 'itemStore',
    alias: WYSIWG_DOCUMENT_STORE_ALIAS,
    name: 'Document Item Store',
    api: () => import('./wysiwg.store.js'),
  },
];
