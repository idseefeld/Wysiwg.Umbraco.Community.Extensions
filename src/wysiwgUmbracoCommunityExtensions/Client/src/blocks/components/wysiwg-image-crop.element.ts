import {
  css,
  customElement,
  html,
  nothing,
  property,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { CropUrlData, WysiwgUmbracoCommunityExtensionsService } from "../..";

@customElement("wysiwg-image-crop")
export class WysiwgBlocksImageCropElement extends UmbLitElement {
  //#region Properties
  /**
   * The unique identifier for the media item.
   * @description This is also known as the media key and is used to fetch the resource.
   */
  @property()
  unique?: string;

  /**
   * The width of the thumbnail in pixels.
   * @default 300
   */
  @property({ type: Number })
  width = 1200;

  /**
   * The alt text for the thumbnail.
   */
  @property()
  alt?: string;

  /**
   * The alt text for the thumbnail.
   */
  @property({ type: String })
  cropAlias = "";

  /**
   * The fallback icon for the thumbnail.
   */
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
    return html`
      ${this.#renderImageCrop()}
      ${when(this._isLoading, () => this.#renderLoading())}
    `;
  }

  override connectedCallback() {
    super.connectedCallback();

    if (this.loading === "lazy") {
      this.#intersectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.#generateImageUrl(entries[0].boundingClientRect.width);
          this.#intersectionObserver?.disconnect();
        }
      });
      this.#intersectionObserver.observe(this);
    } else {
      this.#generateImageUrl(this.width);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#intersectionObserver?.disconnect();
  }

  #renderLoading() {
    return html`<div id="loader"><uui-loader></uui-loader></div>`;
  }

  #renderImageCrop() {
    if (this._isLoading) return nothing;

    return when(
      this._imageUrl,
      () =>
        html`<img
          id="figure-image"
          part="img"
          src="${this._imageUrl ?? ""}"
          alt="${this.alt ?? ""}"
          loading="${this.loading}"
          draggable="false"
        />`,
      () => html`<umb-icon id="icon" name="${this.icon}"></umb-icon>`
    );
  }

  async #requestCropUrl(mediaItemId: string, cropAlias: string, width: number) {
    if (!mediaItemId) {
      return;
    }
    const options: CropUrlData = {
      query: {
        cropAlias,
        mediaItemId,
        width,
      },
    };
    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.cropUrl(options);

    if (error) {
      console.error(error);
      return;
    }

    if (data !== undefined) {
      this._imageUrl = data;
    }
  }

  async #generateImageUrl(width: number) {
    if (!this.unique) throw new Error("Unique is missing");

    await this.#requestCropUrl(this.unique, this.cropAlias, width);
    this._isLoading = false;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
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
        height: 100%;
        overflow: visible;

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
    "wysiwg-image-crop": WysiwgBlocksImageCropElement;
  }
}
