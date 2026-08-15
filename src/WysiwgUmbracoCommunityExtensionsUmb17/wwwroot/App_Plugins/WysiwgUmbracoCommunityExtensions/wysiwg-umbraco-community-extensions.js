import { UMB_WORKSPACE_CONDITION_ALIAS as e } from "@umbraco-cms/backoffice/workspace";
const r = [
  {
    name: "wysiwg Extensions Entrypoint",
    alias: "WysiwgExtensions.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-B5rcutBo.js")
  }
], a = [
  {
    type: "sectionView",
    alias: "WysiwgDashboardElement.Section",
    name: "WYSIWYG Extensions Section",
    element: () => import("./dashboard.element-DDGk3jn9.js"),
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
], n = [
  {
    type: "bundle",
    name: "wysiwg block components",
    alias: "wysiwg.block.components",
    js: () => import("./index-C1--uVQq.js")
  }
], o = "wysiwg65_";
function s() {
  const t = [];
  for (let i = 1; i <= 50; i++)
    t.push(`${o}layout${i}`);
  return t;
}
const l = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./block-layout.view-9zdyVhJS.js"),
    forContentTypeAlias: s(),
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view-BJrPIm8S.js"),
    forContentTypeAlias: o + "headline",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.genericComponent",
    name: "Block Editor Custom View for Component",
    element: () => import("./component.view-bhT-xV1y.js"),
    forContentTypeAlias: o + "genericComponent",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view-CfK1vUym.js"),
    forContentTypeAlias: o + "paragraph",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./picture-with-crop.view-BzJeA2ZP.js"),
    forContentTypeAlias: o + "pictureWithCrop",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view-DyJ-s3uO.js"),
    forContentTypeAlias: o + "croppedPicture",
    forBlockEditor: "block-grid"
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.callToAction",
    name: "Block Editor Custom View for Call to Action",
    element: () => import("./call-to-action.view-kcnHWaBl.js"),
    forContentTypeAlias: o + "callToAction",
    forBlockEditor: "block-grid"
  }
], p = [
  ...n,
  ...l
], c = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ImageAndCropPicker",
    name: "WYSIWG Picture and Crop Picker",
    element: () => import("./wysiwg-image-and-crop-picker.element-DODlo3o_.js"),
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
            propertyEditorUiAlias: "Umb.PropertyEditorUi.ImageCropsConfiguration"
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
], m = [
  {
    type: "propertyEditorUi",
    alias: "wysiwg.PropertyEditorUi.ComponentPicker",
    name: "Wysiwg Component Picker",
    element: () => import("./wysiwg-component-picker.element-tN2spQvW.js"),
    meta: {
      label: "Wysiwg Component PropertyEditorUi Picker",
      propertyEditorSchemaAlias: "Wysiwg.ComponentPicker",
      icon: "icon-list",
      group: "pickers",
      supportsReadOnly: !0
    }
  },
  {
    type: "propertyEditorSchema",
    name: "Wysiwg Component Picker",
    alias: "Wysiwg.ComponentPicker",
    meta: {
      defaultPropertyEditorUiAlias: "wysiwg.PropertyEditorUi.ComponentPicker"
      // settings: {
      //   properties: [],
      // },
    }
  }
], y = [
  ...c,
  ...m
], d = [
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
], g = [
  {
    type: "workspaceContext",
    alias: "Wysiwg.WorkspaceContext.BlockGrid",
    name: "Wysiwg BlockGrid Context",
    api: () => import("./wysiwg.workspace.context-CeinJtuE.js"),
    conditions: [
      {
        alias: e,
        match: "Umb.Workspace.Document"
      }
    ]
  }
], u = [
  ...r,
  ...a,
  ...g,
  ...p,
  ...y,
  ...d
];
export {
  u as manifests
};
//# sourceMappingURL=wysiwg-umbraco-community-extensions.js.map
