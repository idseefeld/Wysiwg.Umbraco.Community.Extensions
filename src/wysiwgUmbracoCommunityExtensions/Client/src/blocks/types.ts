export type BlockGridLayoutModel = {
  alias: string;
  value: {};
  editorAlias: string;
  culture?: string;
  segment?: string;
};

export type MediaPickerPropertyValueEntry = {
	key: string;
	mediaKey: string;
	mediaTypeAlias: string;
	focalPoint: FocalPointModel | null;
	crops: Array<CropModel>;
};

export type CropModel = {
	label?: string;
	alias: string;
	height: number;
	width: number;
	coordinates?: {
		x1: number;
		x2: number;
		y1: number;
		y2: number;
	};
};

export interface FocalPointModel {
	left: number;
	top: number;
}

export type MediaPickerValueModel = Array<MediaPickerPropertyValueEntry>;