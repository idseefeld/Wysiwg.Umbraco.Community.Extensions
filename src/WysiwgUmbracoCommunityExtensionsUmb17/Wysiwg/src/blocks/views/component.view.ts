import {
  html,
  customElement,
  css,
  unsafeHTML,
  state,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";
import { ComponentPickerViewProps } from "./types";
import { BlockPropertyValueModel, postWysiwgPreviewMarkup, PostWysiwgPreviewMarkupData, RequestPreviewMarkupModel } from "../../api";
import { UmbBlockTypeBaseModel } from "@umbraco-cms/backoffice/block-type";
import { UmbBlockDataType } from "@umbraco-cms/backoffice/block";

const customElementName = "wysiwg-generic-component-view";
@customElement(customElementName)
export class WysiwgGenericComponentView
  extends WysiwgBaseBlockEditorCustomViewElement {

  @state()
  markup: string = "";

  @state()
  selectedComponent: string | undefined = undefined;

  @property()
  contentKey?: string;

  @property()
  culture?: string;

  @property({ type: Object })
  blockType?: UmbBlockTypeBaseModel;

  override render() {
    this.getMarkup();
    return html`${unsafeHTML(this.setEditorLink(this.markup))}`;
  }

  private async getMarkup() {
    this.settings = this.getLayoutSettings()

    this.selectedComponent = (this.content as ComponentPickerViewProps)?.componentPicker[0]?.selectedValue;
    if (!this.selectedComponent) {
      this.markup = "<em>[no component selected]</em>";
      return;
    }

    const requestModel = {
        data: {
          contentTypeKey: this.blockType?.contentElementTypeKey ?? "", // "89bb2397-1aac-417f-9e1c-7f3ac0884999",
          key: this.contentKey ?? "", //"744f4fd0-c0e1-4512-9422-16822b87ac75",
          values: [
            {
              value: this.selectedComponent,
              alias: "componentPicker"
            } as BlockPropertyValueModel
          ],
        },
        pageKey: this.documentUnique, // ?? "df06978c-4e12-4205-b020-ba3dccf1fb5a",
        culture: this.culture ?? "",
      } as RequestPreviewMarkupModel;


    const options = { body: requestModel } as PostWysiwgPreviewMarkupData;

    const { data, error } = await postWysiwgPreviewMarkup(options);

    if (error) {
      this.markup = `<em>[error fetching markup for ${this.selectedComponent}]</em>`;
    } else {
      this.markup = data?.toString() ?? "<em>[no markup returned]</em>";
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
