import { ManifestSectionView } from '@umbraco-cms/backoffice/section';

export const manifest: ManifestSectionView = {
  type: 'sectionView',
  alias: "WysiwgDashboardElement.Section",
  name: "WYSIWG Extensions Section",
  element: () => import('./dashboard.element.js'),
  meta: {
    label: "WYSIWG",
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
