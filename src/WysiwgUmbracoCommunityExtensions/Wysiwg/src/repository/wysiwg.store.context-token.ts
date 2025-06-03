import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';
import { WysiwgDocumentItemStore } from './wysiwg.store';

export const WYSIWG_DOCUMENT_ITEM_STORE_CONTEXT = new UmbContextToken<WysiwgDocumentItemStore>('WysiwgDocumentItemStore');
