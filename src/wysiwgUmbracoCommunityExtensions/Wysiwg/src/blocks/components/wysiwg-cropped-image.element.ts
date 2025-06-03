import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { V2CropUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";
import { WysiwgMediaPickerPropertyValueEntry } from "../../property-editors/picture/types";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "wysiwg-cropped-image";
@customElement(elementName)
export class WysiwgCroppedImageElement extends UmbLitElement implements UmbPropertyEditorUiElement {
  //#region Properties
  @property({ type: String })
  value: string = "";

  @property({ type: String })
  alt: string = "";

  @property({ type: Object })
  mediaItem?: WysiwgMediaPickerPropertyValueEntry | null = null;

  @property({ type: Number })
  width = 1200;

  @property()
  icon = "icon-picture";

  /**
   * The `loading` state of the thumbnail.
   * @enum {'lazy' | 'eager'}
   * @default 'lazy'
   */
  @property()
  loading: (typeof HTMLImageElement)["prototype"]["loading"] = "lazy";
  //#endregion

  //#region state

  @state()
  private _isLoading = true;

  //#endregion

  private _prevImgSrc: string = "";

  #intersectionObserver?: IntersectionObserver;

  override render() {
    const img = this.#renderImageCrop();
    const loading = this.#renderLoading();
    return html` ${img} ${loading} `;
  }

  override connectedCallback() {
    super.connectedCallback();

    this.loadImage();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#intersectionObserver?.disconnect();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has("mediaItem")) {
      this.loadImage();
    }
    if (changedProperties.has("value")) {
      if (this._prevImgSrc !== this.value) {
        this.dispatchEvent(new UmbChangeEvent());
        this._prevImgSrc = this.value;
      }
    }
  }

  private loadImage() {
    if (this.loading === "lazy") {
      this.#intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.generateImageUrl(entries[0].boundingClientRect.width);
          this.#intersectionObserver?.disconnect();
        }
      });
      this.#intersectionObserver.observe(this);
    } else {
      this.generateImageUrl(this.width);
    }
  }

  #renderLoading() {
    if (this._isLoading) {
      return html`<div id="loader"><uui-loader></uui-loader></div>`;
    }
  }

  #renderImageCrop() {
    try {
      if (!this.value) {
        return html`<div id="icon" part="img"></div>`;
      } else {
        return html`<img
          id="figure-image"
          src="${this.value ?? ""}"
          alt="${this.alt ?? this.mediaItem?.mediaKey ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />`;
      }
    } catch (e) {
      console.error("wysiwg-image-crop.renderImageCrop error", e);
    }
  }

  private async requestCropUrl(width: number): Promise<string | undefined> {
    if (!this.mediaItem?.mediaKey) {
      return;
    }
    const cropAlias = this.mediaItem.selectedCropAlias?.toLowerCase() ?? "";
    const crop = this.mediaItem.crops?.find((c) => c.alias === cropAlias);
    const selectedCrop = !crop
      ? ""
      : JSON.stringify(crop);
    const selectedFocalPoint = !this.mediaItem.focalPoint
      ? ""
      : JSON.stringify(this.mediaItem.focalPoint);
    const options: V2CropUrlData = {
      query: {
        mediaItemId: this.mediaItem.mediaKey,
        cropAlias: cropAlias,
        width,
        selectedCrop: selectedCrop,
        selectedFocalPoint: selectedFocalPoint
      },
    };

    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.v2CropUrl(options);

    this._isLoading = false;

    if (error) {
      console.error(error);
      return "error";
    }

    if (data !== undefined) {
      return data;
    }

    return "no data";
  }

  private async generateImageUrl(width: number) {
    await this.requestCropUrl(width).then((data) => {
      if (data === "error") {
        this.value = "";
        return;
      } else if (data === "no data") {
        this.value = "";
        return;
      }
      this.value = data ?? "";
    });
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        justify-content: center;
        align-items: center;
      }

      #loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      }

      img {
        display: flex;
        height: auto;
        width: var(--wysiwg-cropped-image-width, 100%);
        margin: var(--wysiwg-image-border-radius, 0);
        border-radius: var(--wysiwg-image-border-radius, 0);

        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
        background-size: 10px 10px;
        background-repeat: repeat;
      }

      #icon {
        width: 100%;
        height: 100%;
        font-size: var(--uui-size-8);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WysiwgCroppedImageElement;
  }
}
