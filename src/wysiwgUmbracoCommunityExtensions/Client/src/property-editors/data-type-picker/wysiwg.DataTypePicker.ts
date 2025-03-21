import type { ManifestPropertyEditorSchema } from '@umbraco-cms/backoffice/property-editor';

export const manifest: ManifestPropertyEditorSchema = {
	type: 'propertyEditorSchema',
	name: 'Data Type Picker',
	alias: 'wysiwg.DataTypePicker',
	meta: {
		defaultPropertyEditorUiAlias: 'wysiwg.PropertyEditorUi.DataTypePicker',
	},
};
