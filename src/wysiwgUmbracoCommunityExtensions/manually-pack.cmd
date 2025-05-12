rem This script is used to build the Umbraco Community Extensions project and create a NuGet package.
rem checklist: update version in \Wysiwg\public\umbraco-package.json, project file (Package > Assembly & file version)
dotnet pack --configuration Release /p:Version=16.0.2-rc6 --output z:\nuget.local
pause
