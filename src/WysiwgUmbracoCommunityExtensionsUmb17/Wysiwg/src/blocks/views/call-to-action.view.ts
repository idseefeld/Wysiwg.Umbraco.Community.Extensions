import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";

const customElementName = "wysiwg-block-call-to-action-view";
@customElement(customElementName)
export class WysiwgBlockCallToActionView
  extends WysiwgBaseBlockEditorCustomViewElement {

  override render() {
    const settings = this.getLayoutSettings();
    const callToActionText = this.content?.label ?? "Call to Action";
    const actionOrUrlArray = this.content?.actionOrUrl;
    const actionOrUrl = (actionOrUrlArray as Array<{ url?: string }> ?? [])[0]?.url ?? "#";
    const jsPrefix = "javascript:";
    const onClick = actionOrUrl.substring(0, jsPrefix.length) === jsPrefix ? actionOrUrl.substring(jsPrefix.length) : `location.href='${actionOrUrl}'`;
    const innerHtml = `<div class="call-to-action"><button ${settings.inlineStyle} title="${onClick}">${callToActionText}</button></div>`;
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
      .call-to-action button {
        display: inline-block;
      }
      .call-to-action button {
        cursor: pointer;
        background-color: var(--wysiwg-call-to-action-background-color, initial);
        color: var(--wysiwg-call-to-action-color, initial);
        border: var(--wysiwg-call-to-action-border, none);
        padding: var(--wysiwg-call-to-action-padding, 0.5em 1em);
        font-size: var(--wysiwg-call-to-action-font-size, 1em);
        border-radius: var(--wysiwg-call-to-action-border-radius, 0.5em);
        box-shadow: var(--wysiwg-call-to-action-box-shadow, rgba(0,0,0,0.3) 5px 10px 10px);
      }
      .call-to-action button:active {
        margin-left: var(--wysiwg-call-to-action-active-margin-left, 10px);
        margin-top: var(--wysiwg-call-to-action-active-margin-top, 10px);
        box-shadow: none;
      }
    `,
  ];
}

export default WysiwgBlockCallToActionView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgBlockCallToActionView;
  }
}
