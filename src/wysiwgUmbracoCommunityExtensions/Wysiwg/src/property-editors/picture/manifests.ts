// import type { ManifestModal } from '@umbraco-cms/backoffice/modal';
import { manifest as schemaManifest } from './Wysiwg.ImageAndCropPicker.js'

const extensionManifest: Array<UmbExtensionManifest> = [
  // {
  //   type: "propertyEditorUi",
  //   alias: "wysiwg.PropertyEditorUi.CropsDropdown",
  //   name: "WYSIWG Dropdown Picture Crops",
  //   element: () => import("./wysiwg-picture-crop-dropdown.element.js"),
  //   meta: {
  //     label: "WYSIWG Dropdown Picture Crops",
  //     propertyEditorSchemaAlias: "Umbraco.Plain.String",
  //     icon: "icon-indent",
  //     group: "lists",
  //     supportsReadOnly: true
  //   },
  // },
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    name: "WYSIWG Picture and Crop Picker",
    element: () => import("./wysiwg-image-and-crop-picker.element.js"),
    meta: {
      label: "WYSIWG Picture and Crop Picker",
      propertyEditorSchemaAlias: "Wysiwg.ImageAndCropPicker",//"Umbraco.Plain.Json",//"Umbraco.Plain.String",//
      icon: "icon-picture",
      group: "media",
      supportsReadOnly: true,
    },
  },
	schemaManifest,
];

// const modals: Array<ManifestModal> = [
// 	{
// 		type: 'modal',
// 		alias: 'Wysiwg.Modal.ImageCropperEditor',
// 		name: 'Wysiwg Image Cropper Editor Modal',
// 		js: () => import('./wysiwg-image-cropper-editor-modal.element.js'),
// 	},
// ];

export const manifests = [
  // ...modals,
  ...extensionManifest,
];
