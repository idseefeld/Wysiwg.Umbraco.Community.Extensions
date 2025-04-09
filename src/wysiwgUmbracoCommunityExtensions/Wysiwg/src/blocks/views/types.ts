import { WysiwgMediaPickerPropertyValues } from "../../property-editors/picture/types";

export type PictureWithCropCustomViewProps = {
  mediaItem: WysiwgMediaPickerPropertyValues;
  cropAliasCollection: string[];
  figCaption: string;
  captionColor: ColorType;
};

export type ColorType = {
  label: string;
  value: string;
};
