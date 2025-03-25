import { MediaPickerValueModel } from "../types";

export type PictureWithCropCustomViewProps = {
  mediaItem: MediaPickerValueModel;
  cropAlias: string[];
  figCaption: string;
  captionColor: ColorType;
};

export type ColorType = {
  label: string;
  value: string;
};
