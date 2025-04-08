import { manifest as schemaManifest } from './Wysiwg.ImageAndCropPicker.js'

const extensionManifest: Array<UmbExtensionManifest> = [
  {
    type: 'propertyEditorUi',
    alias: 'Wysiwg.ImageCropsWithDefaultConfiguration',
    name: 'Image Crops with Default Property Editor UI',
    element: () => import('./wysiwg-image-crops.element.js'),
    meta: {
      label: 'Image Crops Configuration',
      icon: 'icon-autofill',
      group: 'common',
    },
  },
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
	schemaManifest,
];

export const manifests = [
  ...extensionManifest,
];
