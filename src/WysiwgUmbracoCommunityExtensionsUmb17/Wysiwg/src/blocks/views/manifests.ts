export const prefix = "wysiwg65_";
export function getLayoutAliasArray(): Array<string> {
  const layoutAliasArray = [];
  for (let i = 1; i <= 50; i++) {
    layoutAliasArray.push(`${prefix}layout${i}`);
  }
  return layoutAliasArray;

}
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.Layouts",
    name: "Block Editor Custom View for Layouts",
    element: () => import("./block-layout.view.js"),
    forContentTypeAlias: getLayoutAliasArray(),
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockHeadline",
    name: "Block Editor Custom View for Headline",
    element: () => import("./headline.view.js"),
    forContentTypeAlias: prefix + "headline",
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.genericComponent",
    name: "Block Editor Custom View for Generic Component",
    element: () => import("./component.view.js"),
    forContentTypeAlias: prefix + "genericComponent",
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.blockParagraph",
    name: "Block Editor Custom View for Paragraph",
    element: () => import("./paragraph.view.js"),
    forContentTypeAlias: prefix + "paragraph",
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.pictureWithCrop",
    name: "Block Editor Custom View for Picture with Crop",
    element: () => import("./deprecated/picture-with-crop.view.js"),
    forContentTypeAlias: prefix + "pictureWithCrop",
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.croppedPicture",
    name: "Block Editor Custom View for Cropped Picture",
    element: () => import("./cropped-picture.view.js"),
    forContentTypeAlias: prefix + "croppedPicture",
    forBlockEditor: "block-grid",
  },
  {
    type: "blockEditorCustomView",
    alias: "wysiwg.PorpertyEditorUi.callToAction",
    name: "Block Editor Custom View for Call to Action",
    element: () => import("./call-to-action.view.js"),
    forContentTypeAlias: prefix + "callToAction",
    forBlockEditor: "block-grid",
  }
];
