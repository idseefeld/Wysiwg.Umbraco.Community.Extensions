import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement } from "@umbraco-cms/backoffice/external/lit";

export class WysiwgBlockCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement{

}
