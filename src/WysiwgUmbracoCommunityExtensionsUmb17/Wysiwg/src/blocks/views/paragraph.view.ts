import {
  html,
  customElement,
  css,
  unsafeHTML,
  PropertyValues,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";

const customElementName = "wysiwg-block-paragraph-view";
@customElement(customElementName)
export class WysiwgBlockParagraphView
  extends WysiwgBaseBlockEditorCustomViewElement {

  private disableLinks() {
    const paragraphElement = this.shadowRoot?.querySelector('#paragraph') as HTMLFormElement;
    if (!paragraphElement) return;

    const links = paragraphElement.querySelectorAll('a');
    if (links?.length) {
      links.forEach((a) => {
        try {
          a.addEventListener(
            "click",
            (e) => {
              e.preventDefault();
            },
            { capture: true } // Use capture to prevent the event from bubbling up
          );
        } catch (error) {
          console.warn("Error adding event listeners to links:", error);
        }
      });
    }
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    this.disableLinks();
  }

  render() {
    const settings = this.getLayoutSettings()

    var property = this.content?.text as { blocks: {}; markup: string };
    var markup = property?.markup;
    const innerHtml = `<div id="paragraph" ${settings.inlineStyle}>${markup}</div>`;
    return html`${unsafeHTML(this.setEditorLink(innerHtml))}`;
  }

  static override styles = [
    WysiwgBaseBlockEditorCustomViewElement.baseStyles,
    css`
      :host {
        display: block;
        height: 100%;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: var(--wysiwg-font-family, initial);
      }
      #paragraph {
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
        color: var(--wysiwg-paragraph-color, inherit);
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
