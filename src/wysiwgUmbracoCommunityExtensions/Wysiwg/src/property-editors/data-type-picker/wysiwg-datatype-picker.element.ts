import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { html, customElement, state, property, nothing } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_EDITOR_UI_PICKER_MODAL, UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UMB_DATA_TYPE_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/data-type";
import { umbBindToValidation } from "@umbraco-cms/backoffice/validation";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";

const elementName ="wysiwg-datatype-picker";
@customElement(elementName)
export class WysiwgDatatypePickerPropertyEditor extends UmbLitElement implements UmbPropertyEditorUiElement {
  @property()
  public value?: string;

  @state()
  dataTypes: string[] = [];

	@state()
	private _propertyEditorUiIcon?: string | null = null;

	@state()
	private _propertyEditorUiName?: string | null = null;

	@state()
	private _propertyEditorUiAlias?: string | null = null;

	@state()
	private _propertyEditorSchemaAlias?: string | null = null;
  #workspaceContext?: typeof UMB_DATA_TYPE_WORKSPACE_CONTEXT.TYPE;

  #observeDataType() {
		if (!this.#workspaceContext) {
			return;
		}

		this.observe(this.#workspaceContext.propertyEditorUiAlias, (value) => {
			this._propertyEditorUiAlias = value;
		});

		this.observe(this.#workspaceContext.propertyEditorSchemaAlias, (value) => {
			this._propertyEditorSchemaAlias = value;
		});

		this.observe(this.#workspaceContext.propertyEditorUiName, (value) => {
			this._propertyEditorUiName = value;
		});

		this.observe(this.#workspaceContext.propertyEditorUiIcon, (value) => {
			this._propertyEditorUiIcon = value;
		});
	}

  constructor() {
		super();

		this.consumeContext(UMB_DATA_TYPE_WORKSPACE_CONTEXT, (workspaceContext) => {
			this.#workspaceContext = workspaceContext;
			this.#observeDataType();
		});
	}

  async #openPropertyEditorUIPicker() {
		const modalManager = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
		const value = await modalManager
			.open(this, UMB_PROPERTY_EDITOR_UI_PICKER_MODAL, {
				value: {
					selection: this._propertyEditorUiAlias ? [this._propertyEditorUiAlias] : [],
				},
			})
			.onSubmit()
			.catch(() => undefined);

		if (value) {
			this.#workspaceContext?.setPropertyEditorUiAlias(value.selection[0]);
		}
	}

	#renderChooseButton() {
		return html`
			<umb-property-layout
				data-mark="property:editorUiAlias"
				label="Property Editor"
				description=${this.localize.term('propertyEditorPicker_title')}>
				<uui-button
					slot="editor"
					id="btn-add"
					label=${this.localize.term('propertyEditorPicker_title')}
					look="placeholder"
					color="default"
					required
					${umbBindToValidation(this)}
					@click=${this.#openPropertyEditorUIPicker}></uui-button>
			</umb-property-layout>
		`;
	}

  #renderPropertyEditorReference() {
		if (!this._propertyEditorUiAlias || !this._propertyEditorSchemaAlias) return nothing;
		return html`
			<umb-property-layout
				data-mark="property:editorUiAlias"
				label="Property Editor"
				description=${this.localize.term('propertyEditorPicker_title')}>
				<umb-ref-property-editor-ui
					slot="editor"
					name=${this._propertyEditorUiName ?? ''}
					alias=${this._propertyEditorUiAlias}
					property-editor-schema-alias=${this._propertyEditorSchemaAlias}
					standalone
					@open=${this.#openPropertyEditorUIPicker}>
					${this._propertyEditorUiIcon
						? html`<umb-icon name=${this._propertyEditorUiIcon} slot="icon"></umb-icon>`
						: nothing}
					<uui-action-bar slot="actions">
						<uui-button
							label=${this.localize.term('general_change')}
							@click=${this.#openPropertyEditorUIPicker}></uui-button>
					</uui-action-bar>
				</umb-ref-property-editor-ui>
			</umb-property-layout>
		`;
	}

	override render() {
		return html`
			<uui-box>
				${this._propertyEditorUiAlias && this._propertyEditorSchemaAlias
					? this.#renderPropertyEditorReference()
					: this.#renderChooseButton()}
			</uui-box>
		`;
	}
  static override styles = [UmbTextStyles];
}

export default WysiwgDatatypePickerPropertyEditor;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WysiwgDatatypePickerPropertyEditor;
  }
}
