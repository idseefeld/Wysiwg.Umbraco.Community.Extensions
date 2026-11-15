import {
  customElement,
  css,
  state,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";
import { ComponentPickerViewProps, LanguagesWorkspaceContext, } from "./types";
import { BlockPropertyValueModel, postWysiwgPreviewMarkup, PostWysiwgPreviewMarkupData, RequestPreviewMarkupModel } from "../../api";
import { MediaPickerValueModel } from "../types";
import { UmbBlockTypeBaseModel } from "@umbraco-cms/backoffice/block-type";
import { UMB_PROPERTY_DATASET_CONTEXT } from "@umbraco-cms/backoffice/property";
import { UMB_WORKSPACE_CONTEXT, UmbWorkspaceContext } from "@umbraco-cms/backoffice/workspace";

const customElementName = "wysiwg-generic-component-view";
@customElement(customElementName)
export class WysiwgGenericComponentView
  extends WysiwgBaseBlockEditorCustomViewElement {

  @state()
  selectedComponent: string | undefined = undefined;

  @state()
  previewImage: MediaPickerValueModel | undefined = undefined;

  @state()
  culture?: string;

  @property({ attribute: false })
  markup: string = "";

  @property()
  contentKey?: string;

  @property({ type: Object })
  blockType?: UmbBlockTypeBaseModel;

  constructor() {
    super();

    this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, (instance) => {
      if (instance) {
        this.culture = instance.getVariantId().culture ?? '';
        if (!this.culture) {
          this.consumeContext(UMB_WORKSPACE_CONTEXT, (workspaceInstance) => {
            if (workspaceInstance) {
              const languages = (workspaceInstance as LanguagesWorkspaceContext & UmbWorkspaceContext).languages;
              this.culture = languages?.source.value.find((lang: any) => lang.isDefault)?.unique ?? '';
              this.getMarkup();
            }
          });
        } else {
          this.getMarkup();
        }
      }
    });
  }

  override render() {
    const content = this.content as ComponentPickerViewProps;
    const componentPicker = content?.componentPicker ?? [];

    if (this.previewImage !== content?.previewImage) {
      this.previewImage = content?.previewImage ?? "";
    }

    if (this.selectedComponent !== componentPicker) {
      this.selectedComponent = componentPicker;
      this.getMarkup();
    }

    return this.setEditorLink(this.markup);
  }

  private async getMarkup() {
    if (!this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }

    const requestModel = {
      data: {
        contentTypeKey: this.blockType?.contentElementTypeKey ?? "",
        key: this.contentKey ?? "",
        values: [
          {
            value: this.selectedComponent,
            alias: "componentPicker"
          } as BlockPropertyValueModel,
          {
            value: this.previewImage,
            alias: "previewImage"
          } as BlockPropertyValueModel
        ],
      },
      pageKey: this.documentUnique,
      culture: this.culture ?? "",
    } as RequestPreviewMarkupModel;


    const options = { body: requestModel } as PostWysiwgPreviewMarkupData;

    const { data, error } = await postWysiwgPreviewMarkup(options);

    if (error) {
      this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>`;
    } else {
      this.markup = !data ? "<em>[no markup returned]</em>" : data.toString();
    }
  }

  static override styles = [
    WysiwgBaseBlockEditorCustomViewElement.baseStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
    `,
  ];
}

export default WysiwgGenericComponentView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgGenericComponentView;
  }
}
