import { WysiwgMediaPickerPropertyValues } from "../../property-editors/picture/types";
import { MediaPickerValueModel } from "../types";

export type PictureWithCropCustomViewProps = {
  mediaItem: MediaPickerValueModel;
  cropAlias: string[];
  figCaption: string;
  captionColor: ColorType;
};

export type CroppedPictureCustomViewProps = {
  mediaItem: WysiwgMediaPickerPropertyValues;
  cropAliasCollection: string[];
  alternativeText: string;
  figCaption: string;
  captionColor: ColorType;
  rotation: RotationSlider;
};

export type RotationSlider = {
  from: number;
  to: number;
}

export type ColorType = {
  label: string;
  value: string;
};

