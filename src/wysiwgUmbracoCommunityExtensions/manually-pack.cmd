rem This script is used to build the Umbraco Community Extensions project and create a NuGet package. 
dotnet pack --configuration Release /p:Version=15.3.2 --output z:\nuget.local
pause
