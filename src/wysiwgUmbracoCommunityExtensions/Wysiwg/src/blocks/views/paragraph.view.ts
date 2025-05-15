import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  css,
  unsafeHTML,
  PropertyValues,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbBlockEditorCustomViewElement } from "@umbraco-cms/backoffice/block-custom-view";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";

const customElementName = "wysiwg-block-paragraph-view";
@customElement(customElementName)
export class WysiwgBlockParagraphView
  extends WysiwgBaseBlockEditorCustomViewElement {

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("content")) {
      const paragraphElement = this.shadowRoot?.querySelector('div.paragraph') as HTMLFormElement;
      if (!paragraphElement) return;

      const links = paragraphElement.querySelector('a');
      if (links) {
        links.addEventListener("click", (e) => {
          e.preventDefault();
        });
      }

      this.requestUpdate();
    }

  }
  override render() {
    let color = { label: "", value: "" };
    let inlineStyle = "";
    if (this.datasetSettings?.length) {
      const layout = (this as UmbBlockEditorCustomViewElement).layout;
      const settings = this.datasetSettings.filter(
        (s) => layout?.settingsKey === s.key
      )[0]?.values;

      const colorSetting =
        (settings.filter((v) => v.alias === "color")[0]?.value as {
          label: string;
          value: string;
        }) ?? color;
      if (colorSetting?.value) {
        inlineStyle = `color: ${colorSetting?.value};`;
      }

      const minHeight = (settings?.find((v) => v.alias === "minHeight")?.value ?? "0").toString();
      if (minHeight) {
        inlineStyle += `min-height: ${minHeight};`;
      }
    }

    if (inlineStyle) {
      inlineStyle = `style="${inlineStyle}"`;
    }
    var property = this.content?.text as { blocks: {}; markup: string };
    var markup = property?.markup;
    const innerHtml = `<div class="paragraph" ${inlineStyle}>${markup}</div>`;
    return html`${unsafeHTML(innerHtml)}`;
  }

  static override styles = [
    UmbTextStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      .paragraph {
        font-size: var(--wysiwg-font-size-16);
        line-height: var(--wysiwg-line-height-24);
        text-shadow: var(--wysiwg-paragraph-text-shadow, none);
      }
      h2, h3{
        color: var(--wysiwg-paragraph-headline-color, inherit);
        text-shadow: var(--wysiwg-paragraph-headline-text-shadow, none);
      }
      h2 {
        font-size: var(--wysiwg-font-size-24, 24px);
        line-height: var(--wysiwg-line-height-28, 28px);
        margin: var(--wysiwg-headline-paragraph-2-margin, 0);
      }

      h3 {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-headline-paragraph-3-margin, 0);
      }

      p
      {
        font-size: var(--wysiwg-font-size-16, 16px);
        line-height: var(--wysiwg-line-height-24, 24px);
        margin: var(--wysiwg-p-paragraph-margin, 0);
        padding: var(--wysiwg-p-paragraph-padding, 0);
      }

      a{
        color: inherit;
        text-decoration: var(--wysiwg-link-text-decoration, underline);
      }

      a:hover{
        color: var(--wysiwg-link-hover-color, inherit);
      }
    `,
  ];
}

export default WysiwgBlockParagraphView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockParagraphView;
  }
}
