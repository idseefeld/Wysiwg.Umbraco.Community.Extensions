import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
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

  #paragraphElement: HTMLFormElement | null = null;

  #links: NodeListOf<HTMLAnchorElement> | undefined = undefined;

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("content")) {
      this.disableLinks();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.enableLinks();

    super.disconnectedCallback();
  }

  private disableLinks() {
    if (!this.#paragraphElement) {
      this.#paragraphElement = this.shadowRoot?.querySelector('#paragraph') as HTMLFormElement;
      if (!this.#paragraphElement) return;
    }

    this.enableLinks();

    this.#links = this.#paragraphElement.querySelectorAll('a');
    if (this.#links?.length) {
      this.#links.forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
        }));
    }
  }

  private enableLinks() {
    if (!this.#links) return;

    if (this.#links.length) {
      try {
        this.#links.forEach((a) =>
          a.removeEventListener("click", (e) => {
            e.preventDefault();
          }));
      } catch (error) {
        console.warn("Error removing event listeners from links:", error);
      }
    }

    this.#links = undefined;
  }


  render() {
    const settings = this.getLayoutSettings()

    var property = this.content?.text as { blocks: {}; markup: string };
    var markup = property?.markup;
    const innerHtml = `<div id="paragraph" ${settings.inlineStyle}>${markup}</div>`;
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
