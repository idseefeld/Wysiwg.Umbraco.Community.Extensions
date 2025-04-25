import {
  html,
  customElement,
  property,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbBlockDataType } from "@umbraco-cms/backoffice/block";
import { ColorType, CroppedPictureCustomViewProps } from "./types";
import WysiwgBaseBlockEditorCustomViewElement from "./base-block-editor-custom.view";

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
      const img = html`<wysiwg-cropped-image .mediaItem=${mediaCropItem}></wysiwg-cropped-image>`;

      const captionColor =
        pictureWithCrop?.captionColor?.value ?? this.defaultColor.value;
      const caption = pictureWithCrop?.figCaption;
      const inlineStyle = this.isTransparentColor(captionColor) ? '' : `style="color: ${captionColor};"`;
      const figCaption = caption
        ? unsafeHTML(`<figcaption ${inlineStyle}>${caption}</figcaption>`)
        : "";

      return html`<figure>${img}${figCaption}</figure>`;
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
        color: red;
        font-weight: bold;
        text-align: center;
      }
      figure {
        margin: 0;
        padding: 0;
        display: block;
      }
      figcaption {
        font-style: var(--wysiwg-figcaption-font-style, italic);
      }
    `,
  ];
}

export default CroppedPictureCustomView;
