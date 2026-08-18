import {
  css,
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
import { UmbBlockDataModel, UmbBlockDataType, UmbBlockDataValueModel } from "@umbraco-cms/backoffice/block";
import { Debugging, TransparentBackgroundColor } from "../../constants";
import { UMB_DOCUMENT_WORKSPACE_CONTEXT, UmbDocumentWorkspaceContext } from "@umbraco-cms/backoffice/document";
import { ColorType, LayoutSettings } from "./types";
import { WYSIWG_BLOCKGRID_CONTEXT } from "../../context";
import { UpdateStatus } from "../../types";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";

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
  protected documentUnique = '';

  @state()
  protected datasetSettings?: UmbBlockDataModel[];

  @state()
  protected updateStatus: UpdateStatus | undefined = undefined;

  protected _debug = Debugging;

  private _datasetContext?: UmbPropertyDatasetContext;

  private _workspaceContext: UmbDocumentWorkspaceContext | undefined = undefined;

  constructor() {
    super();

    this.consumeContext(WYSIWG_BLOCKGRID_CONTEXT, (context) => {
      if (context) {
        this.observe(context.updateStatusCode, (status) => {
          if (status) {
            this.updateStatus = status;
          }
        }, "_observeWysiwgBlockGridUpdateStatus");
      }
    });

    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this._workspaceContext = context;
      this.observe(this._workspaceContext?.unique, (key) => {
        if (key) {
          this.documentUnique = key;
        }
      }, "_observeWorkspaceStatus");
    });

    this.consumeContext(UMB_PROPERTY_DATASET_CONTEXT, async (context) =>
      this.getSettings(context)
    );
  }

  override disconnectedCallback(): void {
    try {
      super.disconnectedCallback();

      this._workspaceContext = undefined;
      this._datasetContext = undefined;
    } catch (e) {
      console.error("Error in disconnectedCallback:", e);
    }
  }

  private getLayoutDataSettings(): UmbBlockDataValueModel<unknown>[] | undefined {
    if (!this.datasetSettings?.length) { return; }

    const layout = (this as UmbBlockEditorCustomViewElement).layout;
    return this.datasetSettings.filter(
      (s) => layout?.settingsKey === s.key
    )[0]?.values;
  }

  protected setEditorLink(content: string) {
    const editorUrl = this.config?.editContentPath ?? "";
    return `<a id="editor-link" href="${editorUrl}">${content}</a>`;
  }

  protected getLayoutSettings(sizeDefault: string = "h1"): LayoutSettings {
    const rVal = {
      size: sizeDefault,
      inlineStyle: ""
    };

    const settings = this.getLayoutDataSettings();
    if (!settings?.length) { return rVal; }

    rVal.size =
      settings
        .filter((v) => v.alias === "size")[0]
        ?.value?.toString()
        .toLowerCase() ?? rVal.size;

    const color = { label: "", value: "" };
    const colorSetting =
      (settings.filter((v) => v.alias === "color")[0]?.value as ColorType) ?? color;
    if (colorSetting?.value) {
      if (colorSetting.value && !this.isTransparentColor(colorSetting.value)) {
        rVal.inlineStyle = `color: ${colorSetting.value};`;
      }
    }

    const backgroundColor = { label: "", value: "" };
    const backgroundColorSetting =
      (settings.filter((v) => v.alias === "backgroundColor")[0]?.value as ColorType) ?? backgroundColor;
    if (backgroundColorSetting?.value) {
      if (backgroundColorSetting.value && !this.isTransparentColor(backgroundColorSetting.value)) {
        rVal.inlineStyle += `background-color: ${backgroundColorSetting.value};`;
      }
    }

    const margin =
      (settings.filter((v) => v.alias === "margin")[0]?.value as string) ??
      "";
    if (margin) {
      rVal.inlineStyle += `margin: ${margin};`;
    }

    const minHeight = (settings?.find((v) => v.alias === "minHeight")?.value ?? "0").toString();
    if (minHeight) {
      rVal.inlineStyle += `min-height: ${minHeight};`;
    }

    if (rVal.inlineStyle) {
      rVal.inlineStyle = `style="${rVal.inlineStyle}"`;
    }

    return rVal;
  }

  protected isTransparentColor(color: string) {
    return color === TransparentBackgroundColor || color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === 'rgba(255, 255, 255, 0)';
  }

  protected async getSettings(context: any) {
    this._datasetContext = context;
    this.observe(
      this._datasetContext?.properties,
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

  static baseStyles = [
    UmbTextStyles,
    css`
       a#editor-link{
        color: initial;
        text-decoration: none;
        cursor: pointer;
       }
       a#editor-link:hover{
        color: inherit;
       }
    `];
}

export default WysiwgBaseBlockEditorCustomViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBaseBlockEditorCustomViewElement;
  }
}
