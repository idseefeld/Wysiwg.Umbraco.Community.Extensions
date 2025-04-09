import {
  html,
  customElement,
  LitElement,
  property,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbBlockDataType } from "@umbraco-cms/backoffice/block";
import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import { ColorType, PictureWithCropCustomViewProps } from "./types";

@customElement("wysiwg-picturewithcrop-view")
export class PictureWithCropCustomView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement {
  private debugLocalize: boolean = false;
  defaultColor: ColorType = { label: "Black", value: "#000" };

  @property({ attribute: false })
  content?: UmbBlockDataType;

  render() {
    const pictureWithCrop = this.content as PictureWithCropCustomViewProps;
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
      const img = html`<wysiwg-image-crop .mediaItem=${mediaCropItem}></wysiwg-image-crop>`;

      const captionColor =
        pictureWithCrop?.captionColor?.value ?? this.defaultColor.value;
      const caption = pictureWithCrop?.figCaption;
      const inlineStyle = `style="color: ${captionColor};"`;
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
        background-color: transparent;
        /* border-radius: 9px; */
        padding: 0;
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
    `,
  ];
}

export default PictureWithCropCustomView;
