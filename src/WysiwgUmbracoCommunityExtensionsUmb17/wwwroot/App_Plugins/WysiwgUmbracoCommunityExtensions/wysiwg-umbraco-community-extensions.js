import { UMB_WORKSPACE_CONDITION_ALIAS as e } from "@umbraco-cms/backoffice/workspace";
const a = [
  {
    name: "wysiwg Extensions Entrypoint",
    alias: "WysiwgExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-Cbcjt8C-.js")
  }
], r = [
  {
    type: "sectionView",
    alias: "WysiwgDashboardElement.Section",
    name: "WYSIWYG Extensions Section",
    element: () => import("./dashboard.element-DaA2k6pr.js"),
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
], s = [
  {
    type: "bundle",
    name: "wysiwg block components",
    alias: "wysiwg.block.components",
    js: () => import("./index-CskooPw2.js")
  }
], i = "wysiwg65_";
function n() {
  const t = [];
  for (let o = 1; o <= 50; o++)
    t.push(`${i}layout${o}`);
  return t;
}
const l = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./block-layout.view-CUYASreV.js"),
    forContentTypeAlias: n(),
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view-sx2JJfzq.js"),
    forContentTypeAlias: i + "headline",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view-BURaA7ql.js"),
    forContentTypeAlias: i + "paragraph",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./picture-with-crop.view-CfZlHvjJ.js"),
    forContentTypeAlias: i + "pictureWithCrop",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view-CVP3hSKM.js"),
    forContentTypeAlias: i + "croppedPicture",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.callToAction",
    name: "Block Editor Custom View for Call to Action",
    element: () => import("./call-to-action.view-DKNbFlYj.js"),
    forContentTypeAlias: i + "callToAction",
    forBlockEditor: "block-grid"
  }
], c = [
  ...s,
  ...l
], m = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    name: "WYSIWG Picture and Crop Picker",
    element: () => import("./wysiwg-image-and-crop-picker.element-BRcRF30-.js"),
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
], p = [
  ...m
], y = [
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
], d = [
  {
    type: "workspaceContext",
    alias: "Wysiwg.WorkspaceContext.BlockGrid",
    name: "Wysiwg BlockGrid Context",
    api: () => import("./wysiwg.workspace.context-B9sJZpkf.js"),
    conditions: [
      {
        alias: e,
        match: "Umb.Workspace.Document"
      }
    ]
  }
], u = [
  ...a,
  ...r,
  ...d,
  ...c,
  ...p,
  ...y
];
export {
  u as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
