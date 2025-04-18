import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  LitElement,
  property,
  css,
  nothing,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbBlockDataType } from "@umbraco-cms/backoffice/block";
import type {
  UmbBlockEditorCustomViewConfiguration,
  UmbBlockEditorCustomViewElement,
} from "@umbraco-cms/backoffice/block-custom-view";
import {
  UMB_PROPERTY_DATASET_CONTEXT,
  UmbPropertyDatasetContext,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";
import { BlockGridLayoutModel, MediaPickerValueModel } from "../types";
import { ImageUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";

//this is based on a copy of
// Umbraco-CMS\src\
//   Umbraco.Web.UI.Client\src\packages\
//      block\block-grid\components\block-grid-block\block-grid-block.element.ts
const customElementName = "wysiwg-block-layout-view";
@customElement(customElementName)
export class WysiwgBlockLayoutView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement
{
  //#region properties & ctor
  @property({ attribute: false })
  content?: UmbBlockDataType;

  @property({ attribute: false })
  label?: string;

  @property({ type: String, reflect: false })
  icon?: string;

  @property({ attribute: false })
  config?: UmbBlockEditorCustomViewConfiguration;

  @property({ type: Boolean, reflect: true })
  unpublished?: boolean;

  @property({ attribute: false })
  settings?: UmbBlockDataType;

  @state()
  properties?: UmbBlockGridValueModel;

  @state()
  backgroundStyle: string = "";

  @state()
  private _imageUrl?: string;

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
          this.properties = valueValue;
          this.getBackgroudStyle();
        }
      },
      "_observeProperties"
    );
  }
  //#endregion

  async getBackgroudStyle() {
    let inlineStyles = "";

    if (this.properties?.settingsData?.length) {
      const viewElement = this as UmbBlockEditorCustomViewElement;
      const layout = this.properties.layout["Umbraco.BlockGrid"]?.find(
        (l) => l.contentKey === viewElement.contentKey
      );
      const setting = this.properties?.settingsData?.find(
        (s) => s.key === layout?.settingsKey
      );
      const values = setting?.values as BlockGridLayoutModel[];

      const backgroundColor = (
        (values?.find((v) => v.alias === "backgroundColor")?.value ?? {}) as {
          label: string;
          value: string;
        }
      ).value;
      if (backgroundColor) {
        inlineStyles += `background-color: ${backgroundColor};`;
      }

      const padding =
        values?.find((v) => v.alias === "padding")?.value ?? "";
      if (padding) {
        inlineStyles += `padding: ${padding};`;
      }

      const backgroundImage = values?.find((v) => v.alias === "backgroundImage")
        ?.value as MediaPickerValueModel;
      const mediaKey = backgroundImage?.length
        ? backgroundImage[0].mediaKey
        : "";
      await this.#requestImageUrl(mediaKey);
      if (this._imageUrl) {
        inlineStyles += `background-image: url('${this._imageUrl}');`;
      }
    }

    this.backgroundStyle = inlineStyles;
  }

  async #requestImageUrl(mediaItemId: string) {
    if (!mediaItemId) {
      return;
    }
    const options: ImageUrlData = {
      query: {
        mediaItemId,
      },
    };
    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.imageUrl(options);

    if (error) {
      console.error(error);
      return;
    }

    if (data !== undefined) {
      this._imageUrl = data;
    }
  }

  override render() {
    return html`<umb-ref-grid-block class="wysiwg"
      standalone
      href=${(this.config?.showContentEdit
        ? this.config?.editContentPath
        : undefined) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <umb-ufm-render
        slot="name"
        inline
        .markdown=${this.label}
        .value=${this.content}
      ></umb-ufm-render>
      ${this.unpublished
        ? html`<uui-tag
            slot="name"
            look="secondary"
            title=${this.localize.term("wysiwg_notExposedDescription")}
            ><umb-localize key="wysiwg_notExposedLabel"></umb-localize
          ></uui-tag>`
        : nothing}
      <umb-block-grid-areas-container
        slot="areas"
        style="${this.backgroundStyle}"
      ></umb-block-grid-areas-container>
    </umb-ref-grid-block>`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: flex;
        height: 100%;
        box-sizing: border-box;
      }
      .left,
      .right {
        display: flexbox;
      }
    `,
  ];
}

export default WysiwgBlockLayoutView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockLayoutView;
  }
}
