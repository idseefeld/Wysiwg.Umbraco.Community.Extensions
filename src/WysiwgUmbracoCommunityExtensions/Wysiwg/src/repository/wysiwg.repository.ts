import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbItemRepositoryBase } from "@umbraco-cms/backoffice/repository";
import { WysiwgDataSource } from "./wysiwg.data-source";
import { WYSIWG_DOCUMENT_ITEM_STORE_CONTEXT } from "./wysiwg.store.context-token";
import { WysiwgItemModel } from "./types";

export class WysiwgRepository extends UmbItemRepositoryBase<WysiwgItemModel>{
  constructor(host: UmbControllerHost) {
		super(host, WysiwgDataSource, WYSIWG_DOCUMENT_ITEM_STORE_CONTEXT);
	}
}

export { WysiwgRepository as api };
