rem This script is used to build the Umbraco Community Extensions project and create a NuGet package. 
dotnet pack --configuration Release /p:Version=15.4.4-prerelease --output z:\nuget.local
pause
