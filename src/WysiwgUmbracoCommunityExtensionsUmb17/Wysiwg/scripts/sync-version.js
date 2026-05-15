import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Lese Version aus package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);
const version = packageJson.version;

// Aktualisiere umbraco-package.json
const umbracoPackagePath = join(__dirname, '../public/umbraco-package.json');
const umbracoPackage = JSON.parse(readFileSync(umbracoPackagePath, 'utf-8'));

umbracoPackage.version = version;
umbracoPackage.extensions[0].js = umbracoPackage.extensions[0].js.replace(
  /v=[\d.]+/,
  `v=${version}`
);

writeFileSync(umbracoPackagePath, JSON.stringify(umbracoPackage, null, 2) + '\n');
console.log(`✓ Version ${version} synced to umbraco-package.json`);
