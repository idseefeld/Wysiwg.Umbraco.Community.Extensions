import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  LitElement,
  property,
  css,
  nothing,
  state,
  styleMap,
  StyleInfo,
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
  UmbPropertyValueDataPotentiallyWithEditorAlias,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";
import { BlockGridLayoutModel, MediaPickerValueModel } from "../types";
import { ImageUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";

//this is based on a copy of
// Umbraco-CMS\src\
//   Umbraco.Web.UI.Client\src\packages\
//      block\block-grid\components\block-grid-block\block-grid-block.element.ts

const blockLayoutInlineStyleDefaults: StyleInfo = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: "0",
}
const transparentBackgroundColor = "#fff";//work-a-round: color picker does not support transparent

const customElementName = "wysiwg-block-layout-view";
@customElement(customElementName)
export class WysiwgBlockLayoutView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement {
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

  private pageBackroundColor = blockLayoutInlineStyleDefaults.backgroundColor;

  @state()
  backgroundStyleMap: StyleInfo = blockLayoutInlineStyleDefaults;

  private get backgroundStyles() {
    return {
      backgroundImage: this.backgroundStyleMap.backgroundImage,
      backgroundRepeat: this.backgroundStyleMap.backgroundRepeat,
      backgroundPosition: this.backgroundStyleMap.backgroundPosition,
      backgroundColor: this.backgroundStyleMap.backgroundColor,
      padding: this.backgroundStyleMap.padding,
    } as StyleInfo;
  }

  private get backgroundStyleDefaults() {
    return {
      backgroundImage: blockLayoutInlineStyleDefaults.backgroundImage,
      backgroundRepeat: blockLayoutInlineStyleDefaults.backgroundRepeat,
      backgroundPosition: blockLayoutInlineStyleDefaults.backgroundPosition,
      backgroundColor: blockLayoutInlineStyleDefaults.backgroundColor,
      padding: blockLayoutInlineStyleDefaults.padding,
    } as StyleInfo;
  }
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
          let pageBackgroundColor = pageProperties.find((v) => v.alias === "pageBackgroundColor")?.value as {
            label: string;
            value: string;
          }
          if (pageBackgroundColor.value) {
            this.pageBackroundColor = pageBackgroundColor.value;
          }

          const gridValues = pageProperties
            .find((v) => v.editorAlias === "Umbraco.BlockGrid")// && v.alias === "main")
            ?.value as UmbBlockGridValueModel;
          if (gridValues?.settingsData?.length) {
            const viewElement = this as UmbBlockEditorCustomViewElement;
            const layout = gridValues.layout["Umbraco.BlockGrid"]?.find(
              (l) => l.contentKey === viewElement.contentKey
            );
            const setting = gridValues?.settingsData?.find(
              (s) => s.key === layout?.settingsKey
            );
            const properties = setting?.values as BlockGridLayoutModel[] ?? [];
            this.getBackgroudStyle(properties);
            const backgroundImage = properties?.find((v) => v.alias === "backgroundImage")?.value as MediaPickerValueModel;
            const mediaKey = backgroundImage?.length
              ? backgroundImage[0].mediaKey
              : "";
            await this.#requestImageUrl(mediaKey)
              .then((data) => {
                if (data !== undefined && data !== "error") {
                  this.getBackgroudImageStyle(data);
                }
              });
          }
        }
      },
      "_observeProperties"
    );
  }
  //#endregion

  getBackgroudStyle(properties: BlockGridLayoutModel[]) {
    const inlineStyles = this.backgroundStyleDefaults;

    if (properties?.length) {
      const backgroundColor = (
        (properties?.find((v) => v.alias === "backgroundColor")?.value ?? {}) as {
          label: string;
          value: string;
        }
      ).value;
      const transparentBackground = backgroundColor === transparentBackgroundColor;
      if (backgroundColor) {
        inlineStyles.backgroundColor = transparentBackground ? "transparent" : backgroundColor;
      }

      let padding =
        properties?.find((v) => v.alias === "padding")?.value;
      if (!padding) {
        padding = (backgroundColor && !transparentBackground) ? "10px" : "0";
        console.debug("padding: ", padding);
      }
      inlineStyles.padding = `${padding}`;
    }

    this.backgroundStyleMap = inlineStyles;
  }

  getBackgroudImageStyle(imageUrl?: String) {
    const inlineStyles = this.backgroundStyles;

    const padding = inlineStyles.padding ?? blockLayoutInlineStyleDefaults.padding;
    if (imageUrl) {
      inlineStyles.backgroundImage = `url('${imageUrl}')`;
      inlineStyles.backgroundPosition = "inherit";
      inlineStyles.padding = padding === blockLayoutInlineStyleDefaults.padding
        ? "10px"
        : padding;
    } else {
      inlineStyles.backgroundImage = "none";
      inlineStyles.backgroundPosition = "-10000px";
    }

    this.backgroundStyleMap = inlineStyles;
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
      return "error";
    }

    if (data !== undefined) {
      return data;
    }
  }

  override render() {
    const pageStyles = { backgroundColor: this.pageBackroundColor } as Readonly<StyleInfo>;;
    const styles = this.backgroundStyleMap as Readonly<StyleInfo>;

    // console.debug(styles);

    return html`<umb-ref-grid-block class="wysiwg"
      style=${styleMap(pageStyles)}
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
        style="${styleMap(styles)}"
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
