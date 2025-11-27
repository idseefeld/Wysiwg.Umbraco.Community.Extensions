import {
  UmbFocalPointModel,
} from "@umbraco-cms/backoffice/media";

export type WysiwgMediaPickerPropertyValueEntry = {
  key: string;
  mediaKey: string;
  mediaTypeAlias: string;
  focalPoint: UmbFocalPointModel | null;
  crops: Array<WysiwgCropModel>;
  selectedCropAlias?: string;
  cropUrl?: string;
};

export type WysiwgMediaPickerPropertyValues = Array<WysiwgMediaPickerPropertyValueEntry>;

export type WysiwgCropModel = {
  label?: string;
  alias: string;
  height: number;
  width: number;
  defaultCrop?: boolean;
  coordinates?: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  };
};

