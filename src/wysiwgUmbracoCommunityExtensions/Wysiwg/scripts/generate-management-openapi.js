import fetch from 'node-fetch';
import chalk from 'chalk';
import { createClient } from '@hey-api/openapi-ts';
// import fs from 'fs';

// Start notifying user we are generating the TypeScript client
console.log(chalk.green("Generating OpenAPI client..."));

const swaggerUrl = process.argv[2];
if (swaggerUrl === undefined) {
  console.error(chalk.red(`ERROR: Missing URL to OpenAPI spec`));
  console.error(`Please provide the URL to the OpenAPI spec as the first argument found in ${chalk.yellow('package.json')}`);
  console.error(`Example: node generate-openapi.js ${chalk.yellow('https://localhost:44331/umbraco/swagger/REPLACE_ME/swagger.json')}`);
  process.exit();
}

// Needed to ignore self-signed certificates from running Umbraco on https on localhost
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Start checking to see if we can connect to the OpenAPI spec
console.log("Ensure your Umbraco instance is running");
console.log(`Fetching OpenAPI definition from ${chalk.yellow(swaggerUrl)}`);

fetch(swaggerUrl)
  .then(response => {
    if (!response.ok) {
      console.error(chalk.red(`ERROR: OpenAPI spec returned with a non OK (200) response: ${response.status} ${response.statusText}`));
      console.error(`The URL to your Umbraco instance may be wrong or the instance is not running`);
      console.error(`Please verify or change the URL in the ${chalk.yellow('package.json')} for the script ${chalk.yellow('generate-openapi')}`);
      return;
    }

    return response.json();
  })
  .then(openApiSpec => {
    if (!openApiSpec) {
      console.error(chalk.red("ERROR: Failed to fetch OpenAPI spec."));
      return;
    }

    //fs.writeFileSync('./openApiSpec.json', JSON.stringify(openApiSpec, null, 2));

    // Filter the OpenAPI spec manually
    const filteredSpec = {
      ...openApiSpec,
      paths: Object.keys(openApiSpec.paths)
        .filter(path => path.startsWith('/umbraco/management/api/v1/server/')) // Replace with your desired path filter
        .reduce((obj, key) => {
          obj[key] = openApiSpec.paths[key];
          return obj;
        }, {}),
      tags: openApiSpec.tags?.filter(tag => tag.name === 'Server') // Replace with your desired tag filter
    };

    //fs.writeFileSync('./filtered-openapi.json', JSON.stringify(filteredSpec, null, 2));

    console.log(`OpenAPI spec filtered successfully`);
    console.log(`Calling ${chalk.yellow('hey-api')} to generate TypeScript client`);

    createClient({
      client: '@hey-api/client-fetch',
      input: filteredSpec,
      output: 'src/management-api',
      services: {
        asClass: true,
      }
    });
  })
  .catch(error => {
    console.error(`ERROR: Failed to connect to the OpenAPI spec: ${chalk.red(error.message)}`);
    console.error(`The URL to your Umbraco instance may be wrong or the instance is not running`);
    console.error(`Please verify or change the URL in the ${chalk.yellow('package.json')} for the script ${chalk.yellow('generate-openapi')}`);
  });
