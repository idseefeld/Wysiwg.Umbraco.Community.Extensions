import { manifest as schemaManifest } from "./wysiwg.DataTypePicker.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    name: "Data Type Picker Property Editor UI",
    alias: "wysiwg.PropertyEditorUi.DataTypePicker",
		element: () => import('./wysiwg-datatype-picker.element.js'),
    meta: {
      label: 'Data Type Picker',
			propertyEditorSchemaAlias: 'Umbraco.Data',
			icon: 'icon-document',
			group: 'pickers',
			supportsReadOnly: true,
    },
  },
  schemaManifest
];
