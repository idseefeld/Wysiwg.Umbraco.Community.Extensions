export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    name: "WYSIWG Picture and Crop Picker",
    element: () => import("./wysiwg-image-and-crop-picker.element.js"),
    meta: {
      label: "WYSIWG Picture and Crop Picker",
      propertyEditorSchemaAlias: "Wysiwg.ImageAndCropPicker",
      icon: "icon-picture",
      group: "media",
      supportsReadOnly: true,
    },
  },
  {
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
            propertyEditorUiAlias: 'Umb.PropertyEditorUi.ImageCropsConfiguration',
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
  },
];

// export const manifests = [
//   ...extensionManifest,
// ];
