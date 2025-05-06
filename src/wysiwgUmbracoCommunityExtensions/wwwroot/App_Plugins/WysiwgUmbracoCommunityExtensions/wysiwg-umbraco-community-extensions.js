const t = [
  {
    name: "wysiwg Extensions Entrypoint",
    alias: "WysiwgExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-C5ICsXB3.js")
  }
], a = [
  {
    name: "WYSIWG Extensions Dashboard",
    alias: "WysiwgDashboardElement.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-B_ANfST9.js"),
    meta: {
      label: "WYSIWG",
      pathname: "wysiwg-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Packages"
      }
    ]
  }
], r = [
  {
    type: "bundle",
    name: "wysiwg block components",
    alias: "wysiwg.block.components",
    js: () => import("./index-Dves7UhQ.js")
  }
], i = "wysiwg65_";
function s() {
  const e = [];
  for (let o = 1; o <= 50; o++)
    e.push(`${i}layout${o}`);
  return e;
}
const n = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./wysiwg-image-crop.element-DqvFlxl0.js").then((e) => e.b),
    forContentTypeAlias: s(),
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view-DPLPckUa.js"),
    forContentTypeAlias: i + "headline",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view-ChR31KwU.js"),
    forContentTypeAlias: i + "paragraph",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./picture-with-crop.view-uKUklPHt.js"),
    forContentTypeAlias: i + "pictureWithCrop",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view-BrtEb5K0.js"),
    forContentTypeAlias: i + "croppedPicture",
    forBlockEditor: "block-grid"
  }
], l = [
  ...r,
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
    element: () => import("./wysiwg-image-and-crop-picker.element-CBM75-DY.js"),
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
], u = [
  ...c,
  ...d
], g = [
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.En",
    name: "English",
    meta: {
      culture: "en"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnGB",
    name: "English (UK)",
    meta: {
      culture: "en-gb"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnUS",
    name: "English (US)",
    meta: {
      culture: "en-us"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.DeDE",
    name: "German (Germany)",
    meta: {
      culture: "de-de"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/de.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.DeCH",
    name: "German (Switzerland)",
    meta: {
      culture: "de-ch"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localize/de.js"
  }
], E = [
  ...t,
  ...a,
  ...l,
  ...u,
  ...g
];
export {
  E as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
