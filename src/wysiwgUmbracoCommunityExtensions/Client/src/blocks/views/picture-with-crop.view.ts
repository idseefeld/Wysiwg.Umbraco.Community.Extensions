import { html, customElement, LitElement, property, css } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { UmbBlockDataType } from "@umbraco-cms/backoffice/block";
import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import { MediaPickerValueModel } from "../types";

@customElement("wysiwg-picturewithcrop-view")
export class PictureWithCropCustomView extends UmbElementMixin(LitElement) implements UmbBlockEditorCustomViewElement {

  @property({ attribute: false })
  content?: UmbBlockDataType;

  render() {
    const mediaItem = this.content?.mediaItem as MediaPickerValueModel;
    const mediaKey = mediaItem[0]?.mediaKey;

    if (mediaKey.length) {
      const img = html`<wysiwg-image-crop
        unique="${mediaKey}"
        alt="${this.content?.alternativeText ?? ""}"
        cropAlias="${this.content?.cropAlias ?? ""}"></wysiwg-image-crop>`;
      const caption = this.content?.figCaption
        ? html`<figcaption>${this.content?.figCaption}</figcaption>`
        : "";
      return html`<figure>${img}${caption}</figure>`;
    } else {
      return html`<div class="error">No Image selected or found</div>`;//ToDo: get message from localized language file
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
    `,
  ];
}

export default PictureWithCropCustomView;
