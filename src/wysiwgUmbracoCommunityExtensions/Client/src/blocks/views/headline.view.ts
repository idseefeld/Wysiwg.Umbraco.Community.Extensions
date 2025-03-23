import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  LitElement,
  property,
  css,
  state,
  unsafeHTML,
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

const customElementName = "wysiwg-block-headline-view";
@customElement(customElementName)
export class WysiwgBlockHeadlineView
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
    let size = "h1";
    let inlineStyle = "";
    let color = { label: "", value: "" };
    if (this.datasetSettings?.length) {
      const layout = (this as UmbBlockEditorCustomViewElement).layout;
      const settings = this.datasetSettings.filter(
        (s) => layout?.settingsKey === s.key
      )[0]?.values;

      size =
        settings
          .filter((v) => v.alias === "size")[0]
          ?.value?.toString()
          .toLowerCase() ?? size;

      const colorSetting =
        (settings.filter((v) => v.alias === "color")[0]?.value as {
          label: string;
          value: string;
        }) ?? color;

      if (colorSetting?.value) {
        inlineStyle = `style="color: ${colorSetting?.value};"`;
      }
    }
    const headline = this.content?.text ?? "Headline";
    const innerHtml = `<${size} ${inlineStyle}>${headline}</${size}>`;
    return html`${unsafeHTML(innerHtml)}`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        padding-bottom: 1.2%;
      }
      h1 {
        font-size: 24px;
        line-height: 28px;
      }
    `,
  ];
}

export default WysiwgBlockHeadlineView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockHeadlineView;
  }
}
