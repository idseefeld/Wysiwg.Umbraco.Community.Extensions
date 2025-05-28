const e = [
  {
    name: "wysiwg Extensions Entrypoint",
    alias: "WysiwgExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-Cbcjt8C-.js")
  }
], a = [
  {
    type: "sectionView",
    alias: "WysiwgDashboardElement.Section",
    name: "WYSIWYG Extensions Section",
    element: () => import("./dashboard.element-KXYT37Cl.js").then((i) => i.d),
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
  }
], r = [
  {
    type: "bundle",
    name: "wysiwg block components",
    alias: "wysiwg.block.components",
    js: () => import("./index-CMGJlljz.js")
  }
], o = "wysiwg65_";
function n() {
  const i = [];
  for (let t = 1; t <= 50; t++)
    i.push(`${o}layout${t}`);
  return i;
}
const s = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./wysiwg-cropped-image.element-ChvZCHKW.js").then((i) => i.b),
    forContentTypeAlias: n(),
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view-DntOrAj0.js"),
    forContentTypeAlias: o + "headline",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view-Baz2iLtC.js"),
    forContentTypeAlias: o + "paragraph",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./picture-with-crop.view-yRN1eSVr.js"),
    forContentTypeAlias: o + "pictureWithCrop",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view-C48QUSf1.js"),
    forContentTypeAlias: o + "croppedPicture",
    forBlockEditor: "block-grid"
  }
], l = [
  ...r,
  ...s
], p = [
  {
    type: "propertyEditorUi",
    alias: "Wysiwg.ImageCropsWithDefaultConfiguration",
    name: "Image Crops with Default Property Editor UI",
    element: () => import("./wysiwg-image-crops.element-WzjeAO76.js"),
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
    element: () => import("./wysiwg-image-and-crop-picker.element-pFNAOPFJ.js"),
    meta: {
      label: "WYSIWG Picture and Crop Picker",
      propertyEditorSchemaAlias: "Wysiwg.ImageAndCropPicker",
      icon: "icon-picture",
      group: "media",
      supportsReadOnly: !0
    }
  },
  {
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
  }
], c = [
  ...p
], m = [
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.En",
    name: "English",
    meta: {
      culture: "en"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnGB",
    name: "English (UK)",
    meta: {
      culture: "en-gb"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.EnUS",
    name: "English (US)",
    meta: {
      culture: "en-us"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/en.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.DeDE",
    name: "German (Germany)",
    meta: {
      culture: "de-de"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/de.js"
  },
  {
    type: "localization",
    alias: "WysiwgUmbracoCommunityExtensions.Localize.De",
    name: "German",
    meta: {
      culture: "de"
    },
    js: "/App_Plugins/WysiwgUmbracoCommunityExtensions/Localization/de.js"
  }
], y = [
  {
    type: "globalContext",
    alias: "Wysiwg.GlobalContext.BlockGrid",
    name: "Wysiwg BlockGrid Context",
    api: () => import("./wysiwg.context-DFPEezZn.js")
  }
], d = [
  ...e,
  ...a,
  ...y,
  ...l,
  ...c,
  ...m
];
export {
  d as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
