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
import { WysiwgComponentPickerElementPropertyValue } from './types';
import {
  UMB_VALIDATION_EMPTY_LOCALIZATION_KEY,
  UmbFormControlMixin
} from '@umbraco-cms/backoffice/validation';
import {
  getAllComponents,
  GetAllComponentsData,
  GetAllComponentsResponse
} from '../../api';
// import { UMB_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/property';

/*
* based on umb-property-editor-ui-select (version 18.0.0)
*/
const elementName = 'wysiwg-component-picker';
@customElement(elementName)
export class WysiwgComponentPickerElement
  extends UmbFormControlMixin<WysiwgComponentPickerElementPropertyValue | undefined, typeof UmbLitElement, undefined>(UmbLitElement)
  implements UmbPropertyEditorUiElement {

  //#region properties, states, ctor, methods
  //#region properties
  public set config(config: UmbPropertyEditorConfigCollection | undefined) {
    if (!config) return;

    this.getAllComponents();
  }

  //#region states
  @state()
  private _options: Array<UUISelectOption> = [{ value: '', name: '' }, { value: '/Components/ContactForm', name: 'Contact Form' }];

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
  //#endregion

  private async components(): Promise<GetAllComponentsResponse | "error" | "no data"> {
    const options: GetAllComponentsData = {
      url: '/api/v1/wysiwg/all-components'
    }

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

  private async getAllComponents() {
    await this.components()
      .then((data) => {
        if (data === "error") {
          this._options = [];
          return;
        } else if (data === "no data") {
          this._options = [];
          return;
        }
        // const components = data as Array<GetAllComponentsData>;
        // var newOptions = components.map((item) => ({
        //   name: `[${(item.label?.toString() ?? item.alias)}]`,
        //   value: item.alias,
        //   selected: item.alias === this._selectedValue,
        // }));

        this._options = [
          ...this._options,
          // ...newOptions,
        ];
      });
  }



  constructor() {
    super();
    // this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {

    // });
  }

  override firstUpdated() {
    this.addFormControlElement(this.shadowRoot!.querySelector("wysiwg-component-picker")!);
    const componentSelect = this.shadowRoot?.querySelector<UUISelectElement>("umb-input-dropdown-list");
    if (componentSelect) {
      this.addFormControlElement(this.shadowRoot!.querySelector("umb-input-dropdown-list")!);
    }
  }

  render() {
    return html`${this.#renderDropdown()}`;
  }

  #onChangeComponent(event: CustomEvent & { target: UUISelectElement }) {
    const selectedValue = event.target.value;
    this.value = selectedValue ? { value: selectedValue.toString() } : undefined;
  }

  #renderDropdown() {
    const enabled = !this.readonly;
    const label = "component-select";

    if (!this._options.length) return html`<uui-select label=${label}></uui-select>`;

    return html`
        <uui-select
          label=${label}
          .disabled=${!enabled}
          .options=${this._options}
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
