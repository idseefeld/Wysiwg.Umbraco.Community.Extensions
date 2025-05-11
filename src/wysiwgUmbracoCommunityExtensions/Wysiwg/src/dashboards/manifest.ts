import { ManifestSectionView } from '@umbraco-cms/backoffice/section';

export const manifest: ManifestSectionView = {
  type: 'sectionView',
  alias: "WysiwgDashboardElement.Section",
  name: "WYSIWYG Extensions Section",
  element: () => import('./dashboard.element.js'),
  meta: {
    label: "WYSIWYG",
    icon: "icon-settings",
    pathname: "wysiwg-section"
  },
  conditions: [
    {
      alias: 'Umb.Condition.SectionAlias',
      match: 'Umb.Section.Packages',
    }
  ],
};
