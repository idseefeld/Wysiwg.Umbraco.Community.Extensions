const o = [
  {
    name: "wysiwg Extensions Entrypoint",
    alias: "WysiwgExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-rJ-MZUmf.js")
  }
], r = {
  type: "sectionView",
  alias: "WysiwgDashboardElement.Section",
  name: "WYSIWYG Extensions Section",
  element: () => import("./dashboard.element-S6yezZM9.js").then((i) => i.d),
  meta: {
    label: "WYSIWYG",
    icon: "icon-settings",
    pathname: "wysiwg-section"
  },
  conditions: [
    {
      alias: "Umb.Condition.SectionAlias",
      match: "Umb.Section.Packages"
    }
  ]
}, a = [
  {
    type: "bundle",
    name: "wysiwg block components",
    alias: "wysiwg.block.components",
    js: () => import("./index-CqCskS0f.js")
  }
], e = "wysiwg65_";
function s() {
  const i = [];
  for (let t = 1; t <= 50; t++)
    i.push(`${e}layout${t}`);
  return i;
}
const n = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./wysiwg-cropped-image.element-Cb-m-nWn.js").then((i) => i.b),
    forContentTypeAlias: s(),
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view-Bs57Ozuv.js"),
    forContentTypeAlias: e + "headline",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view-DH-GiC5k.js"),
    forContentTypeAlias: e + "paragraph",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./picture-with-crop.view-_QUOV5FD.js"),
    forContentTypeAlias: e + "pictureWithCrop",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view-DUCKyoaH.js"),
    forContentTypeAlias: e + "croppedPicture",
    forBlockEditor: "block-grid"
  }
], l = [
  ...a,
  ...n
], p = {
  type: "propertyEditorSchema",
  name: "Data Type Picker",
  alias: "wysiwg.DataTypePicker",
  meta: {
    defaultPropertyEditorUiAlias: "wysiwg.PropertyEditorUi.DataTypePicker"
  }
}, c = [
  {
    type: "propertyEditorUi",
    name: "Data Type Picker Property Editor UI",
    alias: "wysiwg.PropertyEditorUi.DataTypePicker",
    element: () => import("./wysiwg-datatype-picker.element-BKj-4eik.js"),
    meta: {
      label: "Data Type Picker",
      propertyEditorSchemaAlias: "Umbraco.Data",
      icon: "icon-document",
      group: "pickers",
      supportsReadOnly: !0
    }
  },
  p
], m = {
  type: "propertyEditorSchema",
  name: "Media and Crop Picker",
  alias: "Wysiwg.ImageAndCropPicker",
  meta: {
    defaultPropertyEditorUiAlias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    settings: {
      properties: [
        {
          alias: "filter",
          label: "Accepted types",
          description: "Limit to specific types. Currently only Image and Folder types are supported.",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.MediaTypePicker"
        },
        {
          alias: "startNodeId",
          label: "Start node",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.MediaEntityPicker",
          config: [{ alias: "validationLimit", value: { min: 0, max: 1 } }]
        },
        {
          alias: "enableLocalFocalPoint",
          label: "Enable Focal Point",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
        },
        {
          alias: "crops",
          label: "Image Crops",
          description: "Local crops, stored on document",
          propertyEditorUiAlias: "Wysiwg.ImageCropsWithDefaultConfiguration"
        },
        {
          alias: "ignoreUserStartNodes",
          label: "Ignore User Start Nodes",
          description: "Selecting this option allows a user to choose nodes that they normally dont have access to.",
          propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
        }
      ]
    }
  }
}, y = [
  {
    type: "propertyEditorUi",
    alias: "Wysiwg.ImageCropsWithDefaultConfiguration",
    name: "Image Crops with Default Property Editor UI",
    element: () => import("./wysiwg-image-crops.element-CAGvkQix.js"),
    meta: {
      label: "Image Crops Configuration",
      icon: "icon-autofill",
      group: "common"
    }
  },
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    name: "WYSIWG Picture and Crop Picker",
    element: () => import("./wysiwg-image-and-crop-picker.element-BjfauK8v.js"),
    meta: {
      label: "WYSIWG Picture and Crop Picker",
      propertyEditorSchemaAlias: "Wysiwg.ImageAndCropPicker",
      icon: "icon-picture",
      group: "media",
      supportsReadOnly: !0
    }
  },
  m
], d = [
  ...y
], g = [
  ...c,
  ...d
], u = [
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnGB",
    name: "English (UK)",
    meta: {
      culture: "en"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/en-gb.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnUS",
    name: "English (US)",
    meta: {
      culture: "en-us"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/en-us.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.DeDE",
    name: "German (Germany)",
    meta: {
      culture: "de-de"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/de-de.js"
  }
], E = [
  ...o,
  r,
  ...l,
  ...g,
  ...u
];
export {
  E as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
