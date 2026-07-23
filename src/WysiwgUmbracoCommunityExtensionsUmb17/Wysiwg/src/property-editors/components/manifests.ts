export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'propertyEditorUi',
    alias: 'wysiwg.PropertyEditorUi.ComponentPicker',
    name: 'Wysiwg Component Picker',
    element: () => import('./wysiwg-component-picker.element.js'),
    meta: {
      label: 'Wysiwg Component PropertyEditorUi Picker',
      propertyEditorSchemaAlias: "Wysiwg.ComponentPicker",
      icon: 'icon-list',
      group: 'pickers',
      supportsReadOnly: true,
    },
  },
  {
    type: 'propertyEditorSchema',
    name: 'Wysiwg Component Picker',
    alias: 'Wysiwg.ComponentPicker',
    meta: {
      defaultPropertyEditorUiAlias: 'wysiwg.PropertyEditorUi.ComponentPicker',
      settings: {
        properties: [],
      },
    },
  },
];
