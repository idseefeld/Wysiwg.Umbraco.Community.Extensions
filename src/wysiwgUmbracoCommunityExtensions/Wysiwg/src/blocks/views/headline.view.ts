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
import { ColorType } from "./types";

const customElementName = "wysiwg-block-headline-view";
@customElement(customElementName)
export class WysiwgBlockHeadlineView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement
{
  defaultColor: ColorType = { label: "Black", value: "#000" };

  @property({ attribute: false })
  content?: UmbBlockDataType;

  @property({ attribute: false })
  settings?: UmbBlockDataType;

  @state()
  datasetSettings?: UmbBlockDataModel[];

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

      const color =
        (settings.filter((v) => v.alias === "color")[0]?.value as ColorType)
          ?.value ?? this.defaultColor.value;
      if (color) {
        inlineStyle = `color: ${color};`;
      }
      const margin =
        (settings.filter((v) => v.alias === "margin")[0]?.value as string) ??
        "";
      if (margin) {
        inlineStyle += `margin: ${margin};`;
      }

      if (inlineStyle) {
        inlineStyle = `style="${inlineStyle}"`;
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
    `,
  ];
}

export default WysiwgBlockHeadlineView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockHeadlineView;
  }
}
