
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_DOCUMENT_ITEM_STORE_CONTEXT, UmbDocumentDetailModel } from '@umbraco-cms/backoffice/document';
import { UmbItemStoreBase } from '@umbraco-cms/backoffice/store';

/**
 * @class WysiwgDocumentItemStore copy of UmbDocumentItemStore
 * @augments {UmbStoreBase}
 * @description - Data Store for Document items
 */

export class WysiwgDocumentItemStore extends UmbItemStoreBase<UmbDocumentDetailModel> {
	/**
	 * Creates an instance of WysiwgDocumentItemStore.
	 * @param {UmbControllerHost} host - The controller host for this controller to be appended to
	 * @memberof WysiwgDocumentItemStore
	 */
	constructor(host: UmbControllerHost) {
		super(host, UMB_DOCUMENT_ITEM_STORE_CONTEXT.toString());
	}
}

export { WysiwgDocumentItemStore as api };
