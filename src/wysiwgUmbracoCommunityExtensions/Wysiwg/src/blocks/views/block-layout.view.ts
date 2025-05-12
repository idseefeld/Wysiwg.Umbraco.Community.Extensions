import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  property,
  css,
  nothing,
  state,
  styleMap,
  StyleInfo,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UmbBlockEditorCustomViewElement,
} from "@umbraco-cms/backoffice/block-custom-view";
import {
  UmbPropertyValueDataPotentiallyWithEditorAlias,
} from "@umbraco-cms/backoffice/property";
import { UmbBlockGridValueModel } from "@umbraco-cms/backoffice/block-grid";
import { BlockGridLayoutModel, MediaPickerValueModel } from "../types";
import { ImageUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";
import { UpdateStatus } from "../../util/updateStatusEnum";

//this is based on a copy of
// Umbraco-CMS\src\
//   Umbraco.Web.UI.Client\src\packages\
//      block\block-grid\components\block-grid-block\block-grid-block.element.ts

const blockLayoutInlineStyleDefaults: StyleInfo = {
  backgroundImage: "none",
  backgroundPosition: "inherit",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  padding: undefined,
  minHeight: "0",
}

const customElementName = "wysiwg-block-layout-view";
@customElement(customElementName)
export class WysiwgBlockLayoutView
  extends WysiwgBaseBlockEditorCustomViewElement {

  @property({ attribute: false })
  label?: string;

  @property({ type: String, reflect: false })
  icon?: string;

  @property({ type: Boolean, reflect: true })
  unpublished?: boolean;

  @state()
  private pageBackroundColor = blockLayoutInlineStyleDefaults.backgroundColor;

  @state()
  backgroundStyleMap: StyleInfo = blockLayoutInlineStyleDefaults;

  @state()
  private isfirstElement = false;

  private get backgroundStyles() {
    return {
      backgroundImage: this.backgroundStyleMap.backgroundImage,
      backgroundRepeat: this.backgroundStyleMap.backgroundRepeat,
      backgroundPosition: this.backgroundStyleMap.backgroundPosition,
      backgroundColor: this.backgroundStyleMap.backgroundColor,
      padding: this.backgroundStyleMap.padding,
      minHeight: this.backgroundStyleMap.minHeight,
    } as StyleInfo;
  }

  private get backgroundStyleDefaults() {
    return {
      backgroundImage: blockLayoutInlineStyleDefaults.backgroundImage,
      backgroundRepeat: blockLayoutInlineStyleDefaults.backgroundRepeat,
      backgroundPosition: blockLayoutInlineStyleDefaults.backgroundPosition,
      backgroundColor: blockLayoutInlineStyleDefaults.backgroundColor,
      padding: blockLayoutInlineStyleDefaults.padding,
      minHeight: blockLayoutInlineStyleDefaults.minHeight,
    } as StyleInfo;
  }

  override async prozessSettings(gridValues: UmbBlockGridValueModel) {
    if (gridValues.settingsData?.length) {
      const viewElement = this as UmbBlockEditorCustomViewElement;
      const layouts = gridValues.layout["Umbraco.BlockGrid"];
      if (!layouts) {
        console.error("No layout found");
        return;
      }

      const firstLayoutKey = layouts[0]['contentKey'];
      this.isfirstElement = firstLayoutKey === viewElement.contentKey;
      const layout = layouts?.find(
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

  override async lastStepObservingProperties(pageProperties: Array<UmbPropertyValueDataPotentiallyWithEditorAlias>) {
    if (!pageProperties) return;

    let pageBackgroundColor = pageProperties.find((v) => v.alias === "pageBackgroundColor")?.value as {
      label: string;
      value: string;
    }
    if (pageBackgroundColor?.value) {
      this.pageBackroundColor = pageBackgroundColor.value;
    }
  }

  getBackgroudStyle(properties: BlockGridLayoutModel[]) {
    const inlineStyles = this.backgroundStyleDefaults;

    if (properties?.length) {
      const backgroundColor = (
        (properties?.find((v) => v.alias === "backgroundColor")?.value ?? {}) as {
          label: string;
          value: string;
        }
      ).value;
      const transparentBackground = this.isTransparentColor(backgroundColor);
      if (backgroundColor) {
        inlineStyles.backgroundColor = transparentBackground ? "transparent" : backgroundColor;
      }

      const minHeight = (properties?.find((v) => v.alias === "minHeight")?.value ?? "0").toString();
      inlineStyles.minHeight = minHeight;

      let padding = properties?.find((v) => v.alias === "padding")?.value.toString();
      if (!padding) {
        padding = (backgroundColor && !transparentBackground) ? "10px" : "";
        console.debug("padding: ", padding);
      }
      inlineStyles.padding = padding;
    }

    this.backgroundStyleMap = inlineStyles;
  }

  getBackgroudImageStyle(imageUrl?: String) {
    const inlineStyles = this.backgroundStyles;

    const padding = inlineStyles.padding ?? blockLayoutInlineStyleDefaults.padding;
    if (imageUrl) {
      inlineStyles.backgroundImage = `url('${imageUrl}')`;
      inlineStyles.backgroundPosition = "inherit";
      inlineStyles.padding = !padding || padding === blockLayoutInlineStyleDefaults.padding
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

  renderUpdateHint() {
    const nameHtml = html`<umb-ufm-render inline .markdown=${this.label} .value=${this.content}></umb-ufm-render>`;

    if (!this.isfirstElement) { return nameHtml; }

    this.setUpdateStatus();
    if (this.updateStatus !== UpdateStatus.Update) {
      return nameHtml;
    } else {
      return html`
        <uui-button id="tooltip-toggle" popovertarget="tooltip-popover" look="primary" type="button" color="danger" compact style="margin-right: 0.5rem;">
          <uui-icon name="alert"></uui-icon>
        </uui-button>${nameHtml}

        <uui-popover-container id="tooltip-popover">

          <div class="popover-container" style="display: flex;flex-direction: column;padding: 1rem;border-radius: 3px;width: 200px;background: var(--uui-color-danger);box-shadow: var(--uui-shadow-depth-3);color: white;line-height: 1.4em;">
            <h3>
              <umb-localize key="wysiwg_updateAvailableTitle" .debug=${this._debug}>
                Update Available
              </umb-localize>
            </h3>
            <p>
              <umb-localize key="wysiwg_updateAvailable" .debug=${this._debug}>
                An update is available for the WYSIWYG extensions.
              </umb-localize>
            </p>
          </div>

        </uui-popover-container>
      `;
    }
  }

  override render() {
    const pageStyles = { backgroundColor: this.pageBackroundColor } as Readonly<StyleInfo>;;
    const styles = this.backgroundStyleMap as Readonly<StyleInfo>;

    return html`
    <umb-ref-grid-block class="wysiwg"
      style=${styleMap(pageStyles)}
      standalone
      href=${(this.config?.showContentEdit
        ? this.config?.editContentPath
        : undefined) ?? ""}
    >
      <umb-icon slot="icon" .name=${this.icon}></umb-icon>
      <div slot="name">${this.renderUpdateHint()}</div>
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
