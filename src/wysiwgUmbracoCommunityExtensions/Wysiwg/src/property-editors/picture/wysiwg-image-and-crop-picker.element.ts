import {
  UMB_MEDIA_ENTITY_TYPE,
  UmbMediaPickerPropertyValueEntry,
} from "@umbraco-cms/backoffice/media";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UMB_PROPERTY_CONTEXT } from "@umbraco-cms/backoffice/property";
import {
  UmbPropertyEditorConfigCollection,
  UmbPropertyEditorUiElement,
  UmbPropertyValueChangeEvent,
} from "@umbraco-cms/backoffice/property-editor";
import type { UmbTreeStartNode } from "@umbraco-cms/backoffice/tree";
import {
  UMB_VALIDATION_EMPTY_LOCALIZATION_KEY,
  UmbFormControlMixin,
} from "@umbraco-cms/backoffice/validation";

import {
  UUISelectElement,
  UUISelectEvent,
} from "@umbraco-cms/backoffice/external/uui";
import {
  WysiwgCropModel,
  WysiwgMediaPickerPropertyValueEntry,
  WysiwgMediaPickerPropertyValues,
} from "./types";
import { CropsData, CropsResponse, MediaTypeModel, MediaTypesResponse, WysiwgUmbracoCommunityExtensionsService } from "../../api";
import { UmbNumberRangeValueType } from "@umbraco-cms/backoffice/models";

import type { WysiwgInputRichMediaElement } from "./wysiwg-input-rich-media.element.js";
import './wysiwg-input-rich-media.element.js';

/**
 * based on @element umb-property-editor-ui-media-picker
 */

const elementName = "wysiwg-image-and-crop-picker";
@customElement(elementName)
export class WysiwgImageAndCropPickerElement
  extends UmbFormControlMixin<WysiwgMediaPickerPropertyValues | undefined, typeof UmbLitElement, undefined>(UmbLitElement)
  implements UmbPropertyEditorUiElement {

  //#region properties, states, ctor, methods
  //#region properties
  public set config(config: UmbPropertyEditorConfigCollection | undefined) {
    if (!config) return;

    this._allowedMediaTypes = config.getValueByAlias<string>("filter")?.split(",") ?? [];
    if (this._allowedMediaTypes.length === 0) {
      this.getMediaTypes();
    }
    this._focalPointEnabled = Boolean(config.getValueByAlias("enableLocalFocalPoint"));
    this._multiple = Boolean(config.getValueByAlias("multiple"));

    this._preselectedCrops = config?.getValueByAlias<Array<WysiwgCropModel>>("crops") ?? [];

    if (this._preselectedCrops.length > 0) {
      const defaultCrop = this._preselectedCrops.find((item) => !!item.defaultCrop);
      this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? defaultCrop?.alias ?? "";
      const options = this._preselectedCrops.map((item) => ({
        name: item.label?.toString() ?? item.alias,
        value: item.alias,
        selected: item.alias === this._selectedCropAlias,
      })) as Array<Option & { invalid?: boolean }>;
      this._options = [
        { name: "", value: "", },
        ...options,
      ];
    }

    this.getImageCropperCrops();

    const startNodeId = config.getValueByAlias<string>("startNodeId") ?? "";
    this._startNode = startNodeId ? { unique: startNodeId, entityType: UMB_MEDIA_ENTITY_TYPE } : undefined;

    const minMax = config.getValueByAlias<UmbNumberRangeValueType>('validationLimit');
    this._min = minMax?.min ?? 0;
    this._max = minMax?.max ?? Infinity;
  }

  /**
   * Sets the input to mandatory, meaning validation will fail if the value is empty.
   * @type {boolean}
   */
  @property({ type: Boolean })
  mandatory?: boolean;

  @property({ type: String })
  mandatoryMessage = UMB_VALIDATION_EMPTY_LOCALIZATION_KEY;

  /**
   * Sets the input to readonly mode, meaning value cannot be changed but still able to read and select its content.
   * @type {boolean}
   * @attr
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  readonly = false

  //#endregion

  //#region states
  @state()
  private _startNode?: UmbTreeStartNode;

  @state()
  private _focalPointEnabled: boolean = false;

  @state()
  private _preselectedCrops: Array<WysiwgCropModel> = [];

  @state()
  private _allowedMediaTypes: Array<string> = [];

  @state()
  private _multiple: boolean = false;

  @state()
  private _min: number = 0;

  @state()
  private _max: number = Infinity;

  @state()
  private _alias?: string;

  @state()
  private _variantId?: string;

  // additions
  @state()
  private _selectedCropAlias: string = "";

  @state()
  private _options: Array<Option & { invalid?: boolean }> = [];

  @state()
  private _mediaTypes?: Array<MediaTypeModel> = [];

  @state()
  private _imgSrc: string = "";
  @state()
  private _prevImgSrc: string = "";
  //#endregion

  constructor() {
    super();

    this.consumeContext(UMB_PROPERTY_CONTEXT, (context) => {
      this.observe(context?.alias,
        (alias) => (this._alias = alias),
        "_observeAlias");
      this.observe(context?.variantId,
        (variantId) => (this._variantId = variantId?.toString() || "invariant"),
        "_observeVariantId");
    });
  }

  override firstUpdated() {
    this.addFormControlElement(this.shadowRoot!.querySelector("wysiwg-input-rich-media")!);
    const cropSelect = this.shadowRoot?.querySelector<UUISelectElement>("umb-input-dropdown-list");
    if (cropSelect) {
      this.addFormControlElement(this.shadowRoot!.querySelector("umb-input-dropdown-list")!);
    }
  }

  override focus(options?: FocusOptions) {
    console.log("focus(options) options = ", options);
    return this.shadowRoot?.querySelector<WysiwgInputRichMediaElement>("wysiwg-input-rich-media")?.focus();
  }

  private async getMediaTypes() {
    await this.apiMediaTypes().then((data) => {
      if (data === "error") {
        this._mediaTypes = [];
        return;
      } else if (data === "no data") {
        this._mediaTypes = [];
        return;
      }
      const mediaTypes = data as Array<MediaTypeModel>;

      this._mediaTypes = mediaTypes;
      const imageType = this._mediaTypes?.find((type) => type.alias.toLowerCase() === "image");
      this._allowedMediaTypes = !imageType?.key ? [] : [imageType.key];
    });
  }

  private async apiMediaTypes(): Promise<MediaTypesResponse | "error" | "no data"> {
    const { data, error } = await WysiwgUmbracoCommunityExtensionsService.mediaTypes();
    if (error) {
      console.error(error);
    }
    if (data !== undefined) {
      return data;
    }
    return "no data";
  }

  private async getImageCropperCrops(mediaKey?: string) {
    if (!this._selectedCropAlias) { this._selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? ""; }
    await this.crops(mediaKey).then((data) => {
      if (data === "error") {
        this._preselectedCrops = [];
        return;
      } else if (data === "no data") {
        this._preselectedCrops = [];
        return;
      }
      const imageCrops = data as Array<WysiwgCropModel>;
      var newOptions = imageCrops.map((item) => ({
        name: `[${(item.label?.toString() ?? item.alias)}]`,
        value: item.alias,
        selected: item.alias === this._selectedCropAlias,
      }));

      this._options = [
        ...this._options,
        ...newOptions,
      ];
    });
  }

  private async crops(mediaKey?: string): Promise<CropsResponse | "error" | "no data"> {
    const options: CropsData = {
      query: {
        mediaItemId: mediaKey ?? "",
      },
    };

    const { data, error } =
      await WysiwgUmbracoCommunityExtensionsService.crops(options);

    if (error) {
      console.error(error);
      return "error";
    }

    if (data !== undefined) {
      return data;
    }

    return "no data";
  }

  #onChangeImage(event: CustomEvent & { target: WysiwgInputRichMediaElement }) {
    if (this._imgSrc !== this._prevImgSrc) {
      console.debug("imgSrc changed", this._imgSrc, this._prevImgSrc);
      this._prevImgSrc = this._imgSrc;
    }

    const isEmpty = event.target.value?.length === 0;
    const mediaItems: UmbMediaPickerPropertyValueEntry | undefined =
      event.target.value?.find((item) => !!item.mediaKey) ?? undefined;
    let newValue = isEmpty ? undefined : mediaItems;

    const selectedCropAlias = this.value?.[0]?.selectedCropAlias ?? this._selectedCropAlias;

    if (isEmpty) {
      this._updateValue({
        selectedCropAlias: selectedCropAlias,
      }, true);
    } else {
      const crops = (newValue?.crops.length === 0) ? this._preselectedCrops : newValue?.crops;
      this._updateValue({
        key: newValue?.key,
        mediaKey: newValue?.mediaKey,
        mediaTypeAlias: newValue?.mediaTypeAlias,
        focalPoint: newValue?.focalPoint,
        crops: crops,
        selectedCropAlias: selectedCropAlias,
      } as UmbMediaPickerPropertyValueEntry);
    }
  }

  #onChangeCrop(event: UUISelectEvent) {
    const value = event.target.value as string;
    this._selectedCropAlias = value;

    this._updateValue({
      selectedCropAlias: this._selectedCropAlias,
    });
  }

  private _updateValue(fieldsToUpdate: Partial<WysiwgMediaPickerPropertyValueEntry>, deleteImage: boolean = false) {
    const newValue: WysiwgMediaPickerPropertyValues = [];
    if (!this.value || !this.value.length || deleteImage) {
      const item = {
        ...fieldsToUpdate,
      } as WysiwgMediaPickerPropertyValueEntry;
      newValue.push(item);
    } else {
      for (let i = 0; i < this.value.length; i++) {
        const item = {
          ...this.value[i],
          ...fieldsToUpdate,
        };
        newValue.push(item);
      }
    }
    this.value = newValue;
    this.dispatchEvent(new UmbPropertyValueChangeEvent());
  }

  render() {
    return html`
    <div id="container">
      <div id="left">
        ${this.#renderEditImage()}
        ${this.#renderDropdown()}
      </div>
    </div>`;
  }

  #renderEditImage() {
    return html`
    <wysiwg-input-rich-media
      .alias=${this._alias}
      .allowedContentTypeIds=${this._allowedMediaTypes}
      .focalPointEnabled=${this._focalPointEnabled}
      .value=${this.value ?? []}
      .max=${this._max}
      .min=${this._min}
      .preselectedCrops=${this._preselectedCrops}
      .startNode=${this._startNode}
      .variantId=${this._variantId}
      .required=${this.mandatory}
      .requiredMessage=${this.mandatoryMessage}
      ?multiple=${this._multiple}
      @change=${this.#onChangeImage}
      ?readonly=${this.readonly}
    >
    </wysiwg-input-rich-media>
  `;
  }

  #renderDropdown() {
    const enabled = !!this.value?.length && !!this.value[0]?.mediaKey;
    const label = "crop-select";

    if (!this._options.length) return html`<uui-select label=${label}></uui-select>`;

    return html`
      <uui-select
        label=${label}
        .disabled=${!enabled}
        .options=${this._options}
        @change=${this.#onChangeCrop}
        ?readonly=${this.readonly}
      ></uui-select>
    `;
  }
  //#endregion

  static override readonly styles = [
    UUISelectElement.styles,
    css`
      uui-select {
        margin-top: 8px;
      }

      :host {
        display: inline;
      }

      #container {
        display: flex;
        flex-wrap: wrap;
        row-gap: 20px;
        column-gap: 20px;
        width: 100%;
        min-width: 150px;
        height: 100%;
      }

      #left, #right {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 100%;
        max-width: 200px;
        min-width: 100px;
      }
      #left {
        margin-right: 20px;
      }
    `,
  ];
}

export { WysiwgImageAndCropPickerElement as element };

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WysiwgImageAndCropPickerElement;
  }
}
