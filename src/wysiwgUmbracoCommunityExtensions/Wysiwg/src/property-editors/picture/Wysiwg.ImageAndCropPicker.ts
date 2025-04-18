import type { ManifestPropertyEditorSchema } from '@umbraco-cms/backoffice/property-editor';

export const manifest: ManifestPropertyEditorSchema = {
	type: 'propertyEditorSchema',
	name: 'Media and Crop Picker',
	alias: 'Wysiwg.ImageAndCropPicker',
	meta: {
		defaultPropertyEditorUiAlias: 'wysiwg.PropertyEditorUi.ImageAndCropPicker',
		settings: {
			properties: [
				 {
				 	alias: 'filter',
				 	label: 'Accepted types',
				 	description: 'Limit to specific types. Currently only Image and Folder types are supported.',
				 	propertyEditorUiAlias: 'Umb.PropertyEditorUi.MediaTypePicker',
				 },
				{
					alias: 'startNodeId',
					label: 'Start node',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.MediaEntityPicker',
					config: [{ alias: 'validationLimit', value: { min: 0, max: 1 } }],
				},
				{
					alias: 'enableLocalFocalPoint',
					label: 'Enable Focal Point',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
				},
				{
					alias: 'crops',
					label: 'Image Crops',
					description: 'Local crops, stored on document',
					propertyEditorUiAlias: 'Wysiwg.ImageCropsWithDefaultConfiguration',
				},
				{
					alias: 'ignoreUserStartNodes',
					label: 'Ignore User Start Nodes',
					description: 'Selecting this option allows a user to choose nodes that they normally dont have access to.',
					propertyEditorUiAlias: 'Umb.PropertyEditorUi.Toggle',
				}
			],
		},
	},
};
