export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'blockEditorCustomView',
    alias: 'wysiwg.PorpertyEditorUi.blockHeadline',
    name: 'Block Editor Custom View for Headline',
    element: () => import('./headline.view.js'),
    forContentTypeAlias: 'headline',
    forBlockEditor: 'block-grid',
  },
  {
    type: 'blockEditorCustomView',
    alias: 'wysiwg.PorpertyEditorUi.blockParagraph',
    name: 'Block Editor Custom View for Paragraph',
    element: () => import('./paragraph.view.js'),
    forContentTypeAlias: 'paragaph',
    forBlockEditor: 'block-grid',
  },
  {
    type: 'blockEditorCustomView',
    alias: 'wysiwg.PorpertyEditorUi.Layouts',
    name: 'Block Editor Custom View for Layouts',
    element: () => import('./block-layout.view.js'),
    forContentTypeAlias: ['twoColumnRow','article'],
    forBlockEditor: 'block-grid',
  },
  {
    type: 'blockEditorCustomView',
    alias: 'wysiwg.PorpertyEditorUi.pictureWithCrop',
    name: 'Block Editor Custom View for Picture with Crop',
    element: () => import('./picture-with-crop.view.js'),
    forContentTypeAlias: 'pictureWithCrop',
    forBlockEditor: 'block-grid',
  },
];
