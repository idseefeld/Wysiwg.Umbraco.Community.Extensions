import { manifests as imageAndCropPickerManifests } from "./picture/manifests.js";
import { manifests as componentPickerManifests } from "./components/manifests.js";

export const manifests: Array<UmbExtensionManifest> = [
  ...imageAndCropPickerManifests,
  ...componentPickerManifests,

];
