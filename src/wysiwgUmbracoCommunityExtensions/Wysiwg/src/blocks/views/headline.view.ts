import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";
import { ColorType } from "./types";

const customElementName = "wysiwg-block-headline-view";
@customElement(customElementName)
export class WysiwgBlockHeadlineView
  extends WysiwgBaseBlockEditorCustomViewElement {

  defaultColor: ColorType = { label: "Black", value: "#000" };

  override render() {
    let size = "h1";
    let inlineStyle = "";
    if (this.datasetSettings?.length) {
      const layout = (this as UmbBlockEditorCustomViewElement).layout;
      const settings = this.datasetSettings.filter(
        (s) => layout?.settingsKey === s.key
      )[0]?.values;

      size =
        settings
          .filter((v) => v.alias === "size")[0]
          ?.value?.toString()
          .toLowerCase() ?? size;

      const color =
        (settings.filter((v) => v.alias === "color")[0]?.value as ColorType)
          ?.value ?? this.defaultColor.value;
      if (color && !this.isTransparentColor(color)) {
        inlineStyle = `color: ${color};`;
      }
      const margin =
        (settings.filter((v) => v.alias === "margin")[0]?.value as string) ??
        "";
      if (margin) {
        inlineStyle += `margin: ${margin};`;
      }

      if (inlineStyle) {
        inlineStyle = `style="${inlineStyle}"`;
      }
    }
    const headline = this.content?.text ?? "Headline";
    const innerHtml = `<${size} class="headline" ${inlineStyle}>${headline}</${size}>`;
    return html`${unsafeHTML(innerHtml)}`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      h1, h2, h3 {
        margin: 0;
      }
      .headline{
        color: var(--wysiwg-headline-color, inherit);
        text-shadow: var(--wysiwg-headline-text-shadow, none);
      }
      h1 {
        font-size: var(--wysiwg-headline-1-font-size, 32px);
        line-height: var(--wysiwg-headline-1-line-height, 1.2em);
        margin: var(--wysiwg-headline-1-margin, 0);
      }
      h2 {
        font-size: var(--wysiwg-headline-2-font-size, 28px);
        line-height: var(--wysiwg-headline-2-line-height, 1.2em);
        margin: var(--wysiwg-headline-2-margin, 0);
      }
      h3 {
        font-size: var(--wysiwg-headline-3-font-size , 24px);
        line-height: var(--wysiwg-headline-3-line-height, 1.2em);
        margin: var(--wysiwg-headline-3-margin, 0);
      }
    `,
  ];
}

export default WysiwgBlockHeadlineView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockHeadlineView;
  }
}
