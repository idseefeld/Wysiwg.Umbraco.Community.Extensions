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
import type { UmbBlockEditorCustomViewConfiguration, UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import {
  UMB_PROPERTY_DATASET_CONTEXT,
  UmbPropertyDatasetContext,
  UmbPropertyValueDataPotentiallyWithEditorAlias,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";

const customElementName = "wysiwg-block-paragraph-view";
@customElement(customElementName)
export class WysiwgBlockParagraphView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement {
  //
  @property({ attribute: false })
  content?: UmbBlockDataType;

  @property({ attribute: false })
  config?: UmbBlockEditorCustomViewConfiguration;

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
      async (properties) => {
        const pageProperties = properties as Array<UmbPropertyValueDataPotentiallyWithEditorAlias>;
        if (pageProperties?.length) {
          const allGridValues = pageProperties
            .filter((v) => v.editorAlias === "Umbraco.BlockGrid") as Array<UmbPropertyValueDataPotentiallyWithEditorAlias>;

          const editSettingsPath = this.config?.editSettingsPath ?? "";
          console.debug("editSettingsPath: ", editSettingsPath);

          let thisGrid = allGridValues[0];
          if (allGridValues.length > 1) {
            for (let i = 0; i < allGridValues.length; i++) {
              const grid = allGridValues[i];
              if (grid.alias && (editSettingsPath.indexOf(grid.alias) >= 0)) {
                thisGrid = grid;
                break;
              }
            }
          }
          const gridValues = thisGrid.value as UmbBlockGridValueModel;
          console.debug("thisGrid.alias: ", thisGrid.alias);

          if (gridValues.settingsData?.length) {
            // paragraph specific
            // const valueValue = pageProperties.find((v) => v.editorAlias === "Umbraco.BlockGrid")// && v.alias === "main")
            //   ?.value as UmbBlockGridValueModel;
            // this.datasetSettings = valueValue.settingsData;

            this.datasetSettings = gridValues.settingsData;
          }
        }
      },
      "_observeProperties"
    );
  }

  override render() {
    let color = { label: "", value: "" };
    let inlineStyle = "";
    if (this.datasetSettings?.length) {
      const layout = (this as UmbBlockEditorCustomViewElement).layout;
      const settings = this.datasetSettings.filter(
        (s) => layout?.settingsKey === s.key
      )[0]?.values;

      const colorSetting =
        (settings.filter((v) => v.alias === "color")[0]?.value as {
          label: string;
          value: string;
        }) ?? color;
      if (colorSetting?.value) {
        inlineStyle = `color: ${colorSetting?.value};`;
      }
    }

    if (inlineStyle) {
      inlineStyle = `style="${inlineStyle}"`;
    }
    var property = this.content?.text as { blocks: {}; markup: string };
    var markup = property?.markup;
    const innerHtml = `<div class="paragraph" ${inlineStyle}>${markup}</div>`;
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
        font-family: var(--wysiwg-font-family, initial);
      }

      h2 {
        font-size: var(--wysiwg-font-size-24, 24px);
        line-height: var(--wysiwg-line-height-28, 28px);
        margin: var(--wysiwg-headline-paragraph-2-margin, 0);
      }

      h3 {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-headline-paragraph-3-margin, 0);
      }

      p
      {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-p-paragraph-margin, 0);
        padding: var(--wysiwg-p-paragraph-padding, 0);
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
