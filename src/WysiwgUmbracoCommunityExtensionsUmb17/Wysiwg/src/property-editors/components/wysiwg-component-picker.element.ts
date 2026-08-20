import {
  css,
  customElement,
  html,
  property,
  state
} from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import type {
  UmbPropertyEditorConfigCollection,
  UmbPropertyEditorUiElement
} from '@umbraco-cms/backoffice/property-editor';
import {
  UUISelectElement,
  UUISelectOption
} from '@umbraco-cms/backoffice/external/uui';
import {
  UMB_VALIDATION_EMPTY_LOCALIZATION_KEY,
  UmbFormControlMixin
} from '@umbraco-cms/backoffice/validation';

import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import { getAllComponents, GetAllComponentsData, GetAllComponentsResponse } from '../../api';

/*
* based on umb-property-editor-ui-select (version 18.0.0)
*/
const elementName = 'wysiwg-component-picker';
@customElement(elementName)
export class WysiwgComponentPickerElement
  extends UmbFormControlMixin<string | undefined, typeof UmbLitElement, undefined>(UmbLitElement)
  implements UmbPropertyEditorUiElement {

  //#region properties, states, ctor, methods
  // public set config(config: UmbPropertyEditorConfigCollection | undefined) {
  //   if (!config) return;
  // }
  //#region state
  @state()
  private _options: Array<UUISelectOption> = [{ value: '', name: '' }];

  @state()
  private _selectedValue: string = "";

  //#endregion
  //#region properties
  /**
   * Sets the input to mandatory, meaning validation will fail if the value is empty.
   * @type {boolean}
   */
  @property({ type: Boolean })
  mandatory?: boolean;

  @property({ type: String })
  mandatoryMessage = UMB_VALIDATION_EMPTY_LOCALIZATION_KEY;

  /**
   * Sets the input to readonly mode, meaning value cannot be changed but still able to read and select its content.
   * @type {boolean}
   * @attr
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  readonly = false

  //#endregion

  private async getAllComponents() {

    await this.components().then((data) => {
      if (data === "error" || data === "no data") {
        return;
      }

      const allComponents = data as Array<UUISelectOption>;
      var newOptions = allComponents.map((item) => ({
        name: item.name,
        value: item.value,
        selected: item.value === this._selectedValue,
      }));

      this._options = [
        ...this._options,
        ...newOptions
      ];
    });
  }

  private async components(): Promise<GetAllComponentsResponse | "error" | "no data"> {
    const options = {} as GetAllComponentsData;

    const { data, error } = await getAllComponents(options);

    if (data !== undefined) {
      return data;
    }

    if (error) {
      console.error(error);
      return "error";
    }

    return "no data";
  }

  override firstUpdated() {
    this._selectedValue = this.value ?? "";
    this.getAllComponents();
    const componentSelect = this.shadowRoot?.querySelector<UUISelectElement>("umb-input-dropdown-list");
    if (componentSelect) {
      this.addFormControlElement(this.shadowRoot!.querySelector("umb-input-dropdown-list")!);
    }
  }

  render() {
    return html`${this.#renderDropdown()}`;
  }

  #onChangeComponent(event: CustomEvent & { target: UUISelectElement }) {
    const selectedValue = event.target.value as string | undefined;
    this._selectedValue = selectedValue ?? "";
    this.value = this._selectedValue;

    this.dispatchEvent(new UmbChangeEvent());
  }

  #renderDropdown() {
    const enabled = !this.readonly;
    const label = "component-select";

    if (!this._options?.length) return html`<uui-select label=${label}></uui-select>`;

    return html`
        <uui-select
          label=${label}
          .disabled=${!enabled}
          .options=${this._options ?? []}
          @change=${this.#onChangeComponent}
          ?readonly=${this.readonly}
        ></uui-select>
      `;
  }

  static override readonly styles = [
    UUISelectElement.styles,
    css`
        uui-select {
          margin-top: 8px;
        }

        :host {
          display: inline;
        }
      `,
  ];
}

export default WysiwgComponentPickerElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WysiwgComponentPickerElement;
  }
}
