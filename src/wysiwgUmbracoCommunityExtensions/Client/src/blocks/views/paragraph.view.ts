import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  LitElement,
  property,
  css,
  unsafeHTML,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type {
  UmbBlockDataModel,
  UmbBlockDataType,
} from "@umbraco-cms/backoffice/block";
import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import {
  UMB_PROPERTY_DATASET_CONTEXT,
  UmbPropertyDatasetContext,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";

const customElementName = "wysiwg-block-paragraph-view";
@customElement(customElementName)
export class WysiwgBlockParagraphView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement
{
  //
  @property({ attribute: false })
  content?: UmbBlockDataType;

  @property({ attribute: false })
  settings?: UmbBlockDataType;

  @state()
  datasetSettings?: UmbBlockDataModel[]; //UmbBlockGridValueModel;

  #datasetContext?: UmbPropertyDatasetContext;

  constructor() {
    super();
    this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (context) =>
      this.getSettings(context)
    );
  }

  async getSettings(context: any) {
    this.#datasetContext = context;
    this.observe(
      this.#datasetContext?.properties,
      (value) => {
        if (value?.length) {
          const valueValue = value[0].value as UmbBlockGridValueModel;
          this.datasetSettings = valueValue.settingsData;
        }
      },
      "_observeProperties"
    );
  }

  override render() {
    let color = { label: "", value: "" };
    let inlineStyle = "";
    if (this.datasetSettings?.length) {
      const blockType = (this as UmbBlockEditorCustomViewElement).blockType;
      const settings = this.datasetSettings.filter(
        (s) => blockType?.settingsElementTypeKey === s.contentTypeKey
      )[0]?.values;

      const colorSetting =
        (settings.filter((v) => v.alias === "color")[0]?.value as {
          label: string;
          value: string;
        }) ?? color;
      if (colorSetting?.value) {
        inlineStyle = `style="color: ${colorSetting?.value};"`;
      }
    }

    var property = this.content?.text as { blocks: {}; markup: string };
    var markup = property?.markup;
    const innerHtml = `<div ${inlineStyle}>${markup}</div>`;
    return html`${unsafeHTML(innerHtml)}`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      h2 {
        font-size: 18px;
        line-height: 24px;
      }

      h3 {
        font-size: 1.17em;
        line-height: 24px;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0;
        margin-inline-end: 0;
      }
    `,
  ];
}

export default WysiwgBlockParagraphView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockParagraphView;
  }
}
