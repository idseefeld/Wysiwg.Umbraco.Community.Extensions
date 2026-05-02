import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";

import { DocumentItemResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { DocumentService } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbItemServerDataSourceBase } from "@umbraco-cms/backoffice/repository";
import { UmbItemDataApiGetRequestController } from "@umbraco-cms/backoffice/entity-item";
import { WysiwgItemModel } from "./types";

export class WysiwgDataSource extends UmbItemServerDataSourceBase<DocumentItemResponseModel, WysiwgItemModel> {
  constructor(host: UmbControllerHost) {
    super(host, {
      mapper,
    });
  }

  override async getItems(uniques: Array<string>) {
    if (!uniques) throw new Error('Uniques are missing');

    const itemRequestManager = new UmbItemDataApiGetRequestController(this, {
      api: (args) => DocumentService.getItemDocument({
        query: { id: args.uniques },
      }),
      uniques,
    });

    const { data, error } = await itemRequestManager.request();

    return { data: this._getMappedItems(data), error };
  }
}

const mapper = (item: DocumentItemResponseModel): WysiwgItemModel => {

  return {
    documentType: {
      collection: item.documentType.collection ? { unique: item.documentType.collection.id } : null,
      icon: item.documentType.icon,
      unique: item.documentType.id,
    },
    entityType: UMB_DOCUMENT_ENTITY_TYPE,
    hasChildren: item.hasChildren,
    isProtected: item.isProtected,
    isTrashed: item.isTrashed,
    flags: item.flags || [],
    parent: item.parent ? { unique: item.parent.id } : null,
    unique: item.id,
    variants: item.variants.map((variant) => {
      return {
        culture: variant.culture || null,
        name: variant.name,
        state: variant.state,
        flags: variant.flags || [],
      };
    }),
  };
};
