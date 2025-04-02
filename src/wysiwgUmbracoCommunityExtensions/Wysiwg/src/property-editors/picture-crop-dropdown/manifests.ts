export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.CropsDropdown",
    name: "WYSIWG Dropdown Picture Crops",
    element: () => import("./wysiwg-picture-crop-dropdown.element.js"),
    meta: {
      label: "WYSIWG Dropdown Picture Crops",
      propertyEditorSchemaAlias: "Umbraco.Plain.String",
      icon: "icon-indent",
      group: "lists",
      supportsReadOnly: true
    },
  }
];
