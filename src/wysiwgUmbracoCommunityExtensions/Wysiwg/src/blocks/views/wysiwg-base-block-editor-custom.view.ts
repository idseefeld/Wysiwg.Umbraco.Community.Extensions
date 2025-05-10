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
import { UpdateStatus } from "../../util/updateStatusEnum";
import { UMB_NOTIFICATION_CONTEXT, UmbNotificationContext } from "@umbraco-cms/backoffice/notification";
import { CommonUtilities } from "../../util/common.utilities";
import { Debugging, TransparentBackgroundColor } from "../../constants";

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
  protected datasetSettings?: UmbBlockDataModel[];

  @state()
  protected updateStatus: UpdateStatus | undefined = undefined;

  protected _commonUtilities: CommonUtilities | undefined = undefined;

  protected _debug = Debugging;

  #datasetContext?: UmbPropertyDatasetContext;

  #notificationContext: UmbNotificationContext | undefined = undefined;

  constructor() {
    super();

    this.consumeContext(UMB_NOTIFICATION_CONTEXT, (notificationContext) => {
      this.#notificationContext = notificationContext;
      this._commonUtilities = new CommonUtilities(this.localize, notificationContext);//ToDo: should be singleton via context(?)
    });

    this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (context) =>
      this.getSettings(context)
    );
  }

  protected async setUpdateStatus() {
    if (this.updateStatus) return;

    await this._commonUtilities?.getUpdateStatus(this.#notificationContext).then((status) => {
      if (status) {
        this.updateStatus = status;
      }
    });
  }

  protected isTransparentColor(color: string) {
    return color === TransparentBackgroundColor;
  }

  protected async getSettings(context: any) {
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

  protected async prozessSettings(gridValues: UmbBlockGridValueModel) {
    this.datasetSettings = gridValues.settingsData;
  }

  protected async lastStepObservingProperties(pageProperties: Array<UmbPropertyValueDataPotentiallyWithEditorAlias>) {
    if (!pageProperties) { return; }
  }
}

export default WysiwgBaseBlockEditorCustomViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBaseBlockEditorCustomViewElement;
  }
}
