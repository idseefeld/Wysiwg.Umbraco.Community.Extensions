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
import { MediaPickerValueModel } from "../types";

@customElement("wysiwg-picturewithcrop-view")
export class PictureWithCropCustomView
  extends UmbElementMixin(LitElement)
  implements UmbBlockEditorCustomViewElement
{
  defaultColor: ColorType = { label: "Black", value: "#000" };

  @property({ attribute: false })
  content?: UmbBlockDataType;

  // protected override update(changedProperties: PropertyValues): void {
  //   super.update(changedProperties);
  //   console.debug("PictureWithCropCustomView.update", changedProperties);
  // }

  render() {
    // console.debug("PictureWithCropCustomView.render", this.content);

    const pictureWithCrop = this.content as PictureWithCropCustomViewProps;
    if (!pictureWithCrop) {
      return html`<div class="error">Invalid data</div>`; //ToDo: get message from localized language file
    }
    const mediaItems = pictureWithCrop?.mediaItem ?? [];
    const mediaKey = mediaItems.length ? mediaItems[0].mediaKey : "";
    const cropAlias = pictureWithCrop?.cropAlias[0] ?? "";
    const captionColor =
      pictureWithCrop?.captionColor?.value ?? this.defaultColor.value;
    const caption = pictureWithCrop?.figCaption;

    if (!mediaKey) {
      return html`<div class="error">No Image selected or found</div>`; //ToDo: get message from localized language file
    } else {
      const img = html`<wysiwg-image-crop
        mediaKey="${mediaKey}"
        alt="${this.content?.alternativeText ?? ""}"
        cropAlias="${cropAlias}"></wysiwg-image-crop>`;
      // const img = html`
      //   mediaKey: "${mediaKey}"<br />
      //   alt: "${this.content?.alternativeText ?? ""}" <br />
      //   cropAlias: "${cropAlias}"
      // `;

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
      .error{
        color: red;
        font-weight: bold;
        text-align: center;
      }
    `,
  ];
}

export type PictureWithCropCustomViewProps = {
  mediaItem: MediaPickerValueModel;
  cropAlias: string[];
  figCaption: string;
  captionColor: ColorType;
};

export type ColorType = {
  label: string;
  value: string;
};

export default PictureWithCropCustomView;
