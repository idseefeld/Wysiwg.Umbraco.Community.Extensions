import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { CropUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";

@customElement("wysiwg-image-crop")
export class WysiwgBlocksImageCropElement extends UmbLitElement {
  //#region Properties

  @property({ type: String })
  mediaKey?: string;

  @property({ type: String })
  alt?: string;

  @property({ type: String })
  cropAlias? = "";

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

  @state()
  private _imageUrl: string | undefined = "";

  //#endregion

  #intersectionObserver?: IntersectionObserver;

  override render() {
    //console.debug("wysiwg-image-crop.render", this._imageUrl, this._isLoading);

    const img = this.#renderImageCrop();
    const loading = this.#renderLoading();
    //console.debug("wysiwg-image-crop.render img: ", img);
    //console.debug("wysiwg-image-crop.render loading: ", loading);
    return html` ${img} ${loading} `;
  }

  override connectedCallback() {
    super.connectedCallback();
    //console.debug("wysiwg-image-crop.connectedCallback");

    this.loadImage();
  }

  override disconnectedCallback() {
    //console.debug("wysiwg-image-crop.disconnectedCallback");

    super.disconnectedCallback();
    this.#intersectionObserver?.disconnect();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (
      changedProperties.has("mediaKey") ||
      changedProperties.has("cropAlias")
    ) {
      this.loadImage();
    } else if (changedProperties.has("_imageUrl")) {
      //console.debug("wysiwg-image-crop.updated", this._imageUrl);
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
      if (!this._imageUrl) {
        return html`<div id="icon" part="img"></div>`;
      } else {
        return html`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />`;
      }
    } catch (e) {
      console.error("wysiwg-image-crop.renderImageCrop error", e);
    }
  }

  private async requestCropUrl(width: number): Promise<string | undefined> {
    if (!this.mediaKey) {
      return;
    }
    const options: CropUrlData = {
      query: {
        mediaItemId: this.mediaKey,
        cropAlias: this.cropAlias,
        width,
      },
    };

    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.cropUrl(options);

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
        this._imageUrl = undefined;
        return;
      } else if (data === "no data") {
        this._imageUrl = undefined;
        return;
      }
      this._imageUrl = data;
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

      ::part(img) {
        display: block;
        width: 100%;
        height: auto;
        overflow: visible;

        background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
        background-size: 10px 10px;
        background-repeat: repeat;
      }
      img {
        display: flex;
        width: 100%;
        height: auto;
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
    "wysiwg-image-crop": WysiwgBlocksImageCropElement;
  }
}
