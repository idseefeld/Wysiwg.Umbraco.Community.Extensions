import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";

const customElementName = "wysiwg-block-headline-view";
@customElement(customElementName)
export class WysiwgBlockHeadlineView
  extends WysiwgBaseBlockEditorCustomViewElement {

  override render() {
    const settings = this.getLayoutSettings()

    const headline = this.content?.text ?? "Headline";
    const innerHtml = `<${settings.size} class="headline" ${settings.inlineStyle}>${headline}</${settings.size}>`;
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
