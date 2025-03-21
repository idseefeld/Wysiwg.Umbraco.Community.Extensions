export const name = 'wysiwg.Backoffice.Extensions';
export const manifests = [
	{
		name: 'wysiwg Block Extensions Bundle',
		alias: 'wysiwg.Bundle.BlockExtensions',
		type: 'bundle',
		js: () => import('./blocks/manifests.js'),
	},
	{
		name: 'wysiwg Property Editors Bundle',
		alias: 'wysiwg.Bundle.PropertyEditors',
		type: 'bundle',
		js: () => import('./property-editors/manifests.js'),
	},
];
