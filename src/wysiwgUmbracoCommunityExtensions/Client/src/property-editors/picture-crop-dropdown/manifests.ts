export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.Dropdown",
    name: "Dropdown Picture Crops",
    element: () => import("./wysiwg-picture-crop-dropdown.element.js"),
    meta: {
      label: "Dropdown Picture Crops",
      propertyEditorSchemaAlias: "Umbraco.Plain.String",
      icon: "icon-list",
      group: "lists",
      supportsReadOnly: true,
      settings: {
        properties: [
          {
            alias: 'cropperDataType',
						label: 'Image Cropper Data Type',
						propertyEditorUiAlias: 'wysiwg.PropertyEditorUi.DataTypePicker',
          }
        ]
      }
    },
  }
];
