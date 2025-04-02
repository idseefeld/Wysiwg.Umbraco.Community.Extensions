// get the crop data for a dropdownlist from selected cropper data type
import {
  css,
  html,
  customElement,
  property,
  state,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UUISelectElement,
  UUISelectEvent,
} from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  UmbPropertyEditorConfigCollection,
  UmbPropertyEditorUiElement,
  UmbPropertyValueChangeEvent,
} from "@umbraco-cms/backoffice/property-editor";

@customElement("wysiwg-picture-crop-dropdown")
export class WysiwgPictureCropDropdownElement
  extends UmbLitElement
  implements UmbPropertyEditorUiElement
{
  #selection: Array<string> = [];
  private debugLocalize: boolean = false;

  @property({ type: Array })
  public set value(value: Array<string> | string | undefined) {
    this.#selection = Array.isArray(value) ? value : value ? [value] : [];
  }
  public get value(): Array<string> | undefined {
    return this.#selection;
  }

  /**
   * Sets the input to readonly mode, meaning value cannot be changed but still able to read and select its content.
   * @type {boolean}
   * @attr
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  @state()
  private _options: Array<Option & { invalid?: boolean }> = [];

  async updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("value")) {
      this.#setValue(this.#selection.length > 0 ? this.#selection[0] : null);
    }
  }

  public set config(config: UmbPropertyEditorConfigCollection | undefined) {
    if (!config) return;

    if (Array.isArray(config) && config.length > 0) {
      this._options = config.map((item) => ({
              name: item.value?.toString() ?? item.alias,
              value: item.alias,
              selected: this.#selection.includes(item.alias),
            }));

      // If selection includes a value that is not in the list, add it to the list
      this.#selection.forEach((value) => {
        if (!this._options.find((item) => item.value === value)) {
          this._options.push({
            name: `${value} (${this.localize.term("wysiwg_legacyOption", {
              debug: this.debugLocalize,
            })})`,
            value,
            selected: true,
            invalid: true,
          });
        }
      });
    }
  }

  #onChange(event: UUISelectEvent) {
    const value = event.target.value as string;
    this.#setValue(value ? [value] : []);
  }

  #setValue(value: Array<string> | string | null | undefined) {
    if (!value) return;
    this.value = value;
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  override render() {
    return this.#renderDropdownSingle();
  }

  #renderDropdownValidation() {
    const selectionHasInvalids = this.#selection.some((value) => {
      const option = this._options.find((item) => item.value === value);
      return option ? option.invalid : false;
    });

    if (selectionHasInvalids) {
      return html`<div class="error">
        <umb-localize
          key="wysiwg_legacyOptionDescription"
          .debug=${this.debugLocalize}
          >invalid selection</umb-localize
        >
      </div>`;
    }

    return nothing;
  }

  #renderDropdownSingle() {
    if (!this._options || this._options.length === 0) {
      return html`<umb-debug ?visible=${true}></umb-debug>
        <p class="error">
          <umb-localize key="wysiwg_noOptions" .debug=${this.debugLocalize}
            ></umb-localize
          >
        </p>`;
    }

    return html`
      <umb-input-dropdown-list
        .options=${this._options}
        @change=${this.#onChange}
        ?readonly=${this.readonly}
      ></umb-input-dropdown-list>
      ${this.#renderDropdownValidation()}
    `;
  }

  static override readonly styles = [
    UUISelectElement.styles,
    css`
      #native {
        height: auto;
      }

      .error {
        color: var(--uui-color-danger);
        font-size: var(--uui-font-size-small);
      }
    `,
  ];
}

export default WysiwgPictureCropDropdownElement;

declare global {
  interface HTMLElementTagNameMap {
    "wysiwg-picture-crop-dropdown": WysiwgPictureCropDropdownElement;
  }
}
