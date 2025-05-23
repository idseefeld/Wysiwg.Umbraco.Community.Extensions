import { html, customElement, property, css, repeat, state, query } from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbPropertyValueChangeEvent } from '@umbraco-cms/backoffice/property-editor';
import { generateAlias } from '@umbraco-cms/backoffice/utils';
import { UmbSorterController } from '@umbraco-cms/backoffice/sorter';

export type WysiwgCrop = {
  label: string;
  alias: string;
  width: number;
  height: number;
  defaultCrop: boolean;
};

/**
 * @element umb-property-editor-ui-image-crops
 */
const elementName = "wysiwg-property-editor-ui-image-crops";
@customElement(elementName)
export class WysiwgPropertyEditorUIImageCropsElement extends UmbLitElement implements UmbPropertyEditorUiElement {
  @query('#label')
  private _labelInput!: HTMLInputElement;

  @state()
  private _value: Array<WysiwgCrop> = [];

  @property({ type: Array })
  public set value(value: Array<WysiwgCrop>) {
    this._value = value ?? [];
    this.#sorter.setModel(this.value);
  }
  public get value(): Array<WysiwgCrop> {
    return this._value;
  }

  @state()
  editCropAlias = '';

  #oldInputValue = '';

  #sorter = new UmbSorterController(this, {
    getUniqueOfElement: (element: HTMLElement) => {
      const unique = element.dataset['alias'];
      return unique;
    },
    getUniqueOfModel: (modelEntry: WysiwgCrop) => {
      return modelEntry.alias;
    },
    identifier: 'Umb.SorterIdentifier.ImageCrops',
    itemSelector: '.crop',
    containerSelector: '.crops',
    onChange: ({ model }) => {
      const oldValue = this._value;
      this._value = model;
      this.requestUpdate('_value', oldValue);
      this.dispatchEvent(new UmbPropertyValueChangeEvent());
    },
  });

  #onRemove(alias: string) {
    this.value = [...this.value.filter((item) => item.alias !== alias)];
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  #onEdit(crop: WysiwgCrop) {
    this.editCropAlias = crop.alias;

    const form = this.shadowRoot?.querySelector('form') as HTMLFormElement;
    if (!form) return;

    const label = form.querySelector('#label') as HTMLInputElement;
    const alias = form.querySelector('#alias') as HTMLInputElement;
    const width = form.querySelector('#width') as HTMLInputElement;
    const height = form.querySelector('#height') as HTMLInputElement;
    const defaultCrop = form.querySelector('#defaultCrop') as HTMLInputElement;

    if (!alias || !width || !height) return;

    label.value = crop.label;
    alias.value = crop.alias;
    width.value = crop.width.toString();
    height.value = crop.height.toString();
    defaultCrop.checked = crop.defaultCrop;
  }

  #onEditCancel() {
    this.editCropAlias = '';
  }

  #onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form) return;

    if (!form.checkValidity()) return;

    const formData = new FormData(form);

    const label = formData.get('label') as string;
    const alias = formData.get('alias') as string;
    const width = formData.get('width') as string;
    const height = formData.get('height') as string;
    const defaultCrop = formData.get('defaultCrop') ? true : false;

    if (!label || !alias || !width || !height) return;

    if (!this.value) this.value = [];

    const currentDefaultAlias: string = this.value.find((item) => item.defaultCrop)?.alias ?? '';
    const updateDefaults = defaultCrop === true && currentDefaultAlias !== '' && currentDefaultAlias !== alias;

    const newCrop = {
      label,
      alias,
      width: parseInt(width),
      height: parseInt(height),
      defaultCrop: defaultCrop,
    };

    if (this.editCropAlias) {
      const index = this.value.findIndex((item) => item.alias === this.editCropAlias);
      if (index === -1) return;

      const temp = [...this.value];
      temp[index] = newCrop;
      this.value = [...temp];
      this.editCropAlias = '';
    } else {
      this.value = [...this.value, newCrop];
    }
    if (updateDefaults) {
      this.value = [...this.value.map((item) => ({ ...item, defaultCrop: item.alias === alias }))];
    }
    this.dispatchEvent(new UmbPropertyValueChangeEvent());

    form.reset();
    this._labelInput.focus();
  }

  #renderActions() {
    return this.editCropAlias
      ? html`<uui-button @click=${this.#onEditCancel}>Cancel</uui-button>
					<uui-button look="secondary" type="submit" label="Save"></uui-button>`
      : html`<uui-button look="secondary" type="submit" label="Add"></uui-button>`;
  }

  #onLabelInput() {
    const value = this._labelInput.value ?? '';

    const aliasValue = generateAlias(value);

    const alias = this.shadowRoot?.querySelector('#alias') as HTMLInputElement;

    if (!alias) return;

    const oldAliasValue = generateAlias(this.#oldInputValue);

    if (alias.value === oldAliasValue || !alias.value) {
      alias.value = aliasValue;
    }

    this.#oldInputValue = value;
  }

  override render() {
    if (!this.value) this.value = [];

    return html`
			<uui-form>
				<form @submit=${this.#onSubmit}>
					<div class="input">
            <uui-toggle pristine="" label-position="top" id="defaultCrop" name="defaultCrop" label="Default">
              <b>Default</b>
            </uui-toggle>
          </div>
					<div class="input">
						<uui-label for="label">Label</uui-label>
						<uui-input
							@input=${this.#onLabelInput}
							label="Label"
							id="label"
							name="label"
							type="text"
							autocomplete="false"
							value=""></uui-input>
					</div>
					<div class="input">
						<uui-label for="alias">Alias</uui-label>
						<uui-input label="Alias" id="alias" name="alias" type="text" autocomplete="false" value=""></uui-input>
					</div>
					<div class="input">
						<uui-label for="width">Width</uui-label>
						<uui-input label="Width" id="width" name="width" type="number" autocomplete="false" value="" min="0">
							<span class="append" slot="append">px</span>
						</uui-input>
					</div>
					<div class="input">
						<uui-label for="height">Height</uui-label>
						<uui-input label="Height" id="height" name="height" type="number" autocomplete="false" value="" min="0">
							<span class="append" slot="append">px</span>
						</uui-input>
					</div>
					<div class="action-wrapper">${this.#renderActions()}</div>
				</form>
			</uui-form>
			<div class="crops">
				${repeat(
      this.value,
      (item) => item.alias,
      (item) => html`
						<div class="crop" data-alias="${item.alias}">
							<span class="crop-drag">+</span>
							<span><strong>${item.label}</strong> <em>(${item.alias})</em></span>
							<span class="crop-size">(${item.width} x ${item.height}px)</span>
              <span class="crop-default">${item.defaultCrop ? 'default crop' : ''}</span>
							<div class="crop-actions">
								<uui-button
									label=${this.localize.term('general_edit')}
									color="default"
									@click=${() => this.#onEdit(item)}></uui-button>
								<uui-button
									label=${this.localize.term('general_remove')}
									color="danger"
									@click=${() => this.#onRemove(item.alias)}></uui-button>
							</div>
						</div>
					`,
    )}
			</div>
		`;
  }

  static override readonly styles = [
    UmbTextStyles,
    css`
			:host {
				display: block;
			}
			.crops {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-2);
				margin-top: var(--uui-size-space-4);
			}
			.crop {
				display: flex;
				align-items: center;
				background: var(--uui-color-background);
			}
			.crop-drag {
				cursor: grab;
				padding-inline: var(--uui-size-space-4);
				color: var(--uui-color-disabled-contrast);
				font-weight: bold;
			}
			.crop-size {
				font-size: 0.9em;
				padding-inline: var(--uui-size-space-4);
			}
      .crop-default {
        font-size: 0.9em;
				padding-inline: var(--uui-size-space-4);
        color: var(--uui-color-success-emphasis);
        size: 30px;
      }
			.crop-actions {
				display: flex;
				margin-left: auto;
			}
			form {
				display: flex;
				gap: var(--uui-size-space-2);
			}
			.input {
				display: flex;
				flex-direction: column;
			}
			.append {
				padding-inline: var(--uui-size-space-4);
				background: var(--uui-color-disabled);
				border-left: 1px solid var(--uui-color-border);
				color: var(--uui-color-disabled-contrast);
				font-size: 0.8em;
				display: flex;
				align-items: center;
			}
			.action-wrapper {
				display: flex;
				align-items: flex-end;
			}
		`,
  ];
}

export default WysiwgPropertyEditorUIImageCropsElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WysiwgPropertyEditorUIImageCropsElement;
  }
}
