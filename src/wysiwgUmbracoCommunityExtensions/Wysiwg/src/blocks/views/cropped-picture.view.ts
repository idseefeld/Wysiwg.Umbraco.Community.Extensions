import {
  html,
  customElement,
  property,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbBlockDataType } from "@umbraco-cms/backoffice/block";
import { ColorType, CroppedPictureCustomViewProps } from "./types";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";

@customElement("wysiwg-croppedicture-view")
export class CroppedPictureCustomView
  extends WysiwgBaseBlockEditorCustomViewElement {

  private debugLocalize: boolean = false;
  defaultColor: ColorType = { label: "Black", value: "#000" };

  @property({ attribute: false })
  content?: UmbBlockDataType;

  render() {
    const pictureWithCrop = this.content as CroppedPictureCustomViewProps;
    if (!pictureWithCrop) {
      return html`<div class="error">
        <umb-localize key="wysiwg_invalidData" .debug=${this.debugLocalize}
          >invalid data</umb-localize
        >
      </div>`;
    }
    const mediaCropItems = pictureWithCrop?.mediaItem ?? [];
    const mediaCropItem = mediaCropItems[0] ?? null;
    const mediaKey = mediaCropItem ? mediaCropItem.mediaKey : "";
    if (!mediaKey) {
      return html`<div class="error">
        <umb-localize key="wysiwg_noImageSelected" .debug=${this.debugLocalize}
          >No image selected or found</umb-localize
        >
      </div>`;
    } else {
      const alt = pictureWithCrop?.alternativeText ?? mediaCropItem?.selectedCropAlias ?? "";
      const img = html`<wysiwg-cropped-image class="wysiwg-cropped-image" .mediaItem=${mediaCropItem} .alt=${alt}></wysiwg-cropped-image>`;

      const caption = pictureWithCrop?.figCaption;
      const captionColor =
        pictureWithCrop?.captionColor?.value ?? this.defaultColor.value;
      const rotationStyle = pictureWithCrop?.rotation?.from ? `transform: rotate(${pictureWithCrop.rotation.from}deg);` : '';
      const colorStyle = this.isTransparentColor(captionColor) ? '' : `style="color: var(--wysiwg-figcaption-color,${captionColor});"`;
      const figCaption = caption
        ? unsafeHTML(`<figcaption ${colorStyle}>${caption}</figcaption>`)
        : "";

      //const figureHtml = unsafeHTML(`<figure ${rotationStyle}>${img}${figCaption}</figure>`);

      return html`<figure style=${rotationStyle}>${img}${figCaption}</figure>`;
    }
  }

  static styles = [
    css`
      :host {
        display: block;
        height: auto;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .error {
        color: var(--wysiwg-error-color, #cc0000);
        font-weight: bold;
        text-align: center;
      }
      figure {
        margin: 0;
        padding: 0;
        display: block;

        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
      }
      figcaption {
        display: inline-block;
        margin: var(--wysiwg-figcaption-margin, 0);
        padding: var(--wysiwg-figcaption-padding, 0);
        color: var(--wysiwg-figcaption-color, inherit);
        font-style: var(--wysiwg-figcaption-font-style, italic);
        font-variant: var(--wysiwg-figcaption-font-variant, normal);
        font-weight: var(--wysiwg-figcaption-font-weight, normal);
        font-size: var(--wysiwg-figcaption-font-size, 90%);
        font-family: var(--wysiwg-figcaption-font-family, inherit);
        line-height: var(--wysiwg-figcaption-line-height, 1.2em);
        text-shadow: var(--wysiwg-figcaption-text-shadow, none);
      }
      .wysiwg-cropped-image {
        border-radius: var(--wysiwg-cropped-image-border-radius, 0);
        border-style: var(--wysiwg-cropped-image-border-style, none);
        border-width: var(--wysiwg-cropped-image-border-width, 0);
        border-color: var(--wysiwg-cropped-image-border-color, transparent);
        box-shadow: var(--wysiwg-cropped-image-box-shadow, none);
        background-color: var(--wysiwg-cropped-image-background-color, transparent);
      }
    `,
  ];
}

export default CroppedPictureCustomView;
