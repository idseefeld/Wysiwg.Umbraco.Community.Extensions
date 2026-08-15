import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import {
  html,
  customElement,
  css,
  unsafeHTML,
} from "@umbraco-cms/backoffice/external/lit";
import WysiwgBaseBlockEditorCustomViewElement from "./wysiwg-base-block-editor-custom.view";
import { ComponentPickerViewProps } from "./types";

const customElementName = "wysiwg-generic-component-view";
@customElement(customElementName)
export class WysiwgGenericComponentView
  extends WysiwgBaseBlockEditorCustomViewElement {

  override render() {
    let selectedComponent = (this.content as ComponentPickerViewProps)?.componentPicker[0]?.selectedValue;
    if(!selectedComponent) {
      selectedComponent = "<em>[no component selected]</em>";
    }
    const innerHtml = `<div class="component">${selectedComponent}</div>`;
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
    `,
  ];
}

export default WysiwgGenericComponentView;

declare global {
  interface HTMLElementTagNameMap {
    [customElementName]: WysiwgGenericComponentView;
  }
}
