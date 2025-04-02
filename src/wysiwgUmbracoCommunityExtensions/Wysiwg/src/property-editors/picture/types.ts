import {
  UmbCropModel,
  UmbFocalPointModel,
} from "@umbraco-cms/backoffice/media";

export type WysiwgMediaPickerPropertyValueEntry = {
  key: string;
  mediaKey: string;
  mediaTypeAlias: string;
  focalPoint: UmbFocalPointModel | null;
  crops: Array<UmbCropModel>;
  selectedCropAlias: string;
};

