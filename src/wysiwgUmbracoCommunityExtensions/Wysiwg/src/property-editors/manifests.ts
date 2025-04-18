import { manifests as dataTypePickerManifests } from "./data-type-picker/manifests.js";
import { manifests as imageAndCropPickerManifests } from "./picture/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...dataTypePickerManifests,
  ...imageAndCropPickerManifests
];
