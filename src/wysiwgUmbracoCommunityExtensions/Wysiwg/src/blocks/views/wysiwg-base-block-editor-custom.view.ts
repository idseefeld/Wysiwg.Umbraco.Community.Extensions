import {
  customElement,
  LitElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbBlockEditorCustomViewConfiguration, UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import {
  UMB_PROPERTY_DATASET_CONTEXT,
  UmbPropertyDatasetContext,
  UmbPropertyValueDataPotentiallyWithEditorAlias,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";
import { UmbBlockDataModel, UmbBlockDataType } from "@umbraco-cms/backoffice/block";

const transparentBackgroundColor = "#fff";//work-a-round: color picker does not support transparent color

const customElementName = "wysiwg-base.block-editor-custom-view";
@customElement(customElementName)
export class WysiwgBaseBlockEditorCustomViewElement
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement {

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

  isTransparentColor(color: string) {
    return color === transparentBackgroundColor;
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

          this.prozessSettings(gridValues);

          this.lastStepObservingProperties(pageProperties);
        }
      },
      "_observeProperties"
    );
  }

  async prozessSettings(gridValues: UmbBlockGridValueModel) {
    this.datasetSettings = gridValues.settingsData;
  }

  async lastStepObservingProperties(pageProperties: Array<UmbPropertyValueDataPotentiallyWithEditorAlias>) {
    if (!pageProperties) return;
  }
}

export default WysiwgBaseBlockEditorCustomViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBaseBlockEditorCustomViewElement;
  }
}
