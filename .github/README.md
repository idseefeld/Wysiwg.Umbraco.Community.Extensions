# wysiwgUmbracoCommunityExtensions

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.wysiwgUmbracoCommunityExtensions?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.wysiwgUmbracoCommunityExtensions/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.wysiwgUmbracoCommunityExtensions?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.wysiwgUmbracoCommunityExtensions)
[![GitHub license](https://img.shields.io/github/license/idseefeld/Wysiwg.Umbraco.Community.Extensions?color=8AB803)](../LICENSE)

This package was created with the [***Opinionated Umbraco Package Starter Template***](https://github.com/idseefeld/opinionated-package-starter) based on the official [*Umbraco Extensions*](https://github.com/umbraco/Umbraco-CMS/tree/contrib/templates/UmbracoExtension) template and gives you a starting point with additional examples for advanced Block Grid views within the backoffice.

![Screenshot: backoffice vs frontend](../docs/screenshots/BOvsFrontend.jpg)



<!--
Including screenshots is a really good idea! 

If you put images into /docs/screenshots, then you would reference them in this readme as, for example:

<img alt="..." src="https://github.com/idseefeld/Wysiwg.Umbraco.Community.Extensions/blob/develop/docs/screenshots/screenshot.png">
-->

## Installation

Add the package to an existing Umbraco website (v15+) from nuget:

`dotnet add package Umbraco.Community.wysiwgUmbracoCommunityExtensions`

Currently you need to manually setup the Block Grid views in the backoffice. This will be automated in a future release: While debuging your website call /umbraco/swagger and choose from the dropdown *wysiwgUmbraco Community Extensions Backoffice API*, authorize (in the popup leave client_secret blank) and click *Try it out* and _**Execute**_ buttons in the install panel. This should respond with status 200: "Installed"

![Screenshot: backoffice vs frontend](../docs/screenshots/swagger-install.jpg)

Now go to the settings section of the backoffice and you should find new Document and Data types:
![Screenshot: backoffice vs frontend](../docs/screenshots/doc-data-types.jpg)

Place the Datatype "wysiwg65_BlockGrid" on a document type and create a new content node. You should see the new Block Grid view in the backoffice!

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

## Acknowledgments

Many thanks to the whole [Umbraco](https://umbraco.com/) team and [Lotte Pitcher](https://github.com/LottePitcher)!<br> **H5YR!** 