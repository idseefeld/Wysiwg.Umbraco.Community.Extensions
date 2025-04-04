import { WysiwgMediaPickerPropertyValues } from "../../property-editors/picture/types";
// import { MediaPickerValueModel } from "../types";

export type PictureWithCropCustomViewProps = {
  mediaItem: WysiwgMediaPickerPropertyValues; //MediaPickerValueModel;
  cropAliasCollection: string[];
  figCaption: string;
  captionColor: ColorType;
};

export type ColorType = {
  label: string;
  value: string;
};
