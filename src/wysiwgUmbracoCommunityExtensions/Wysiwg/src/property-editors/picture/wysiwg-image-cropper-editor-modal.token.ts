import {
  UmbCropModel,
  UmbImageCropperCrop,
} from "@umbraco-cms/backoffice/media";
import { UmbModalToken } from "@umbraco-cms/backoffice/modal";

export interface WysiwgImageCropperEditorModalData<ItemType> {
  key: string;
  unique: string;
  hideFocalPoint: boolean;
  cropOptions: Array<UmbCropModel>;
  pickableFilter?: (item: ItemType) => boolean;
}

export interface WysiwgImageCropperEditorModalValue {
  key: string;
  unique: string;
  crops: Array<UmbImageCropperCrop>;
  focalPoint: { left: number; top: number };
}

export const WYSIWG_IMAGE_CROPPER_EDITOR_MODAL = new UmbModalToken<
  WysiwgImageCropperEditorModalData<any>,
  WysiwgImageCropperEditorModalValue
>("Wysiwg.Modal.ImageCropperEditor", {
  modal: {
    type: "sidebar",
    size: "full",
  },
});
