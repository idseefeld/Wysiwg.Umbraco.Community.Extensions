import {
  UmbCropModel,
  UmbMediaPickerPropertyValueEntry,
} from "@umbraco-cms/backoffice/media";

export type WysiwgMediaPickerPropertyValueEntry = UmbMediaPickerPropertyValueEntry & {
  selectedCropAlias?: string | null;
  cropUrl?: string | null;
};

export type WysiwgMediaPickerModel = Array<WysiwgMediaPickerPropertyValueEntry>;

export type WysiwgCropModel = UmbCropModel & {
  defaultCrop?: boolean;
};

