import { manifests as dataTypePickerManifests } from "./data-type-picker/manifests.js";
import { manifests as pictureCropDropdownManifests } from "./picture/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...dataTypePickerManifests,
  ...pictureCropDropdownManifests
];
