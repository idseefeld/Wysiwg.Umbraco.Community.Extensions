using System.Text.Json;
using System.Text.Json.Serialization;
using WysiwgUmbracoCommunityExtensions.Models;

namespace TestProject1.BlockGrid
{
    public class BGModelsTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test(Description = "Test deserialization of block grid data type configuration json")]
        public void Deserialize()
        {
            // following json was captured during degub session of WysiwgUmbracoCommunityExtensions.Services.SetupService
            var json = @"{
""blocks"":
[{""contentElementTypeKey"":""86b27c79-e192-42f6-8bf9-738704390fac"",""allowAtRoot"":false,""allowInAreas"":true,""settingsElementTypeKey"":""7e83f87b-0039-4a24-babe-2c70b8d87738"",""groupKey"":null,""areas"":null},{""contentElementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""allowAtRoot"":false,""allowInAreas"":true,""settingsElementTypeKey"":""30b1616f-6413-4e0a-a473-3f4e12ff1da6"",""groupKey"":null,""areas"":null},{""contentElementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""allowAtRoot"":false,""allowInAreas"":true,""settingsElementTypeKey"":null,""groupKey"":""e29f82c3-d423-4ae6-b61e-ce82448f8d6d"",""areas"":null},{""contentElementTypeKey"":""42b84599-5718-4a33-8c5e-f8e55f894a8b"",""allowAtRoot"":true,""allowInAreas"":false,""settingsElementTypeKey"":""2b163efb-047e-4056-9b2d-fda2a75d647a"",""groupKey"":""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",""areas"":[{""key"":""7c1273c5-9f77-4014-b421-3b905486ed40"",""alias"":""Full Row"",""columnSpan"":12,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[]}]},{""contentElementTypeKey"":""14812cc7-6017-4cba-94e7-47533d4ded18"",""allowAtRoot"":true,""allowInAreas"":false,""settingsElementTypeKey"":""2b163efb-047e-4056-9b2d-fda2a75d647a"",""groupKey"":""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",""areas"":[{""key"":""eab939a1-f394-4f76-9b3c-a4c2a364cded"",""alias"":""left"",""columnSpan"":6,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]},{""key"":""b1a766ca-1dde-47f7-a7de-3c66dac18f5b"",""alias"":""right"",""columnSpan"":6,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]}]},{""contentElementTypeKey"":""cca33fef-df2b-40d7-ab4b-34c718254d26"",""allowAtRoot"":true,""allowInAreas"":false,""settingsElementTypeKey"":""2b163efb-047e-4056-9b2d-fda2a75d647a"",""groupKey"":""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",""areas"":[{""key"":""90cb6911-788a-4f93-99cf-6618343dd15f"",""alias"":""left"",""columnSpan"":4,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]},{""key"":""4f848f06-1571-4f24-9c3c-f24dd0940448"",""alias"":""right"",""columnSpan"":8,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]}]},{""contentElementTypeKey"":""884cb66d-7e64-49a9-b77a-a084c0264fdd"",""allowAtRoot"":true,""allowInAreas"":false,""settingsElementTypeKey"":""2b163efb-047e-4056-9b2d-fda2a75d647a"",""groupKey"":""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",""areas"":[{""key"":""55017aa7-2b8a-478a-beca-b056ed966b6a"",""alias"":""left"",""columnSpan"":8,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]},{""key"":""f970853c-d0cb-4fc1-b9e4-e50e83c5c151"",""alias"":""right"",""columnSpan"":4,""rowSpan"":1,""minAllowed"":0,""specifiedAllowance"":[{""elementTypeKey"":""727a7413-8396-494b-8b44-f1cda1b168f3"",""minAllowed"":0},{""elementTypeKey"":""41e84212-0d59-47f4-b697-539f63c71af4"",""minAllowed"":0}]}]}]}";

            json = @"{
""blocks"": [
  {
    ""contentElementTypeKey"": ""86b27c79-e192-42f6-8bf9-738704390fac"",
    ""allowAtRoot"": false,
    ""allowInAreas"": true,
    ""settingsElementTypeKey"": ""7e83f87b-0039-4a24-babe-2c70b8d87738"",
    ""groupKey"": null,
    ""areas"": null
  },
  {
    ""contentElementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
    ""allowAtRoot"": false,
    ""allowInAreas"": true,
    ""settingsElementTypeKey"": ""30b1616f-6413-4e0a-a473-3f4e12ff1da6"",
    ""groupKey"": null,
    ""areas"": null
  },
  {
    ""contentElementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
    ""allowAtRoot"": false,
    ""allowInAreas"": true,
    ""settingsElementTypeKey"": null,
    ""groupKey"": ""54026792-757d-4bbc-bf1c-51367a83b08a"",
    ""areas"": null
  },
  {
    ""contentElementTypeKey"": ""42b84599-5718-4a33-8c5e-f8e55f894a8b"",
    ""allowAtRoot"": true,
    ""allowInAreas"": false,
    ""settingsElementTypeKey"": ""2b163efb-047e-4056-9b2d-fda2a75d647a"",
    ""groupKey"": ""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",
    ""areas"": [
      {
        ""key"": ""7c1273c5-9f77-4014-b421-3b905486ed40"",
        ""alias"": ""Full Row"",
        ""columnSpan"": 12,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": []
      }
    ]
  },
  {
    ""contentElementTypeKey"": ""14812cc7-6017-4cba-94e7-47533d4ded18"",
    ""allowAtRoot"": true,
    ""allowInAreas"": false,
    ""settingsElementTypeKey"": ""2b163efb-047e-4056-9b2d-fda2a75d647a"",
    ""groupKey"": ""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",
    ""areas"": [
      {
        ""key"": ""eab939a1-f394-4f76-9b3c-a4c2a364cded"",
        ""alias"": ""left"",
        ""columnSpan"": 6,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      },
      {
        ""key"": ""b1a766ca-1dde-47f7-a7de-3c66dac18f5b"",
        ""alias"": ""right"",
        ""columnSpan"": 6,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      }
    ]
  },
  {
    ""contentElementTypeKey"": ""cca33fef-df2b-40d7-ab4b-34c718254d26"",
    ""allowAtRoot"": true,
    ""allowInAreas"": false,
    ""settingsElementTypeKey"": ""2b163efb-047e-4056-9b2d-fda2a75d647a"",
    ""groupKey"": ""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",
    ""areas"": [
      {
        ""key"": ""90cb6911-788a-4f93-99cf-6618343dd15f"",
        ""alias"": ""left"",
        ""columnSpan"": 4,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      },
      {
        ""key"": ""4f848f06-1571-4f24-9c3c-f24dd0940448"",
        ""alias"": ""right"",
        ""columnSpan"": 8,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      }
    ]
  },
  {
    ""contentElementTypeKey"": ""884cb66d-7e64-49a9-b77a-a084c0264fdd"",
    ""allowAtRoot"": true,
    ""allowInAreas"": false,
    ""settingsElementTypeKey"": ""2b163efb-047e-4056-9b2d-fda2a75d647a"",
    ""groupKey"": ""00a9bf38-cfab-41cd-8d7a-56ae2b1af4f2"",
    ""areas"": [
      {
        ""key"": ""55017aa7-2b8a-478a-beca-b056ed966b6a"",
        ""alias"": ""left"",
        ""columnSpan"": 8,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      },
      {
        ""key"": ""f970853c-d0cb-4fc1-b9e4-e50e83c5c151"",
        ""alias"": ""right"",
        ""columnSpan"": 4,
        ""rowSpan"": 1,
        ""minAllowed"": 0,
        ""specifiedAllowance"": [
          {
            ""elementTypeKey"": ""727a7413-8396-494b-8b44-f1cda1b168f3"",
            ""minAllowed"": 0
          },
          {
            ""elementTypeKey"": ""41e84212-0d59-47f4-b697-539f63c71af4"",
            ""minAllowed"": 0
          }
        ]
      }
    ]
  },
  {
    ""contentElementTypeKey"": ""7db67437-2476-40e4-96dc-f10050ccf2e3"",
    ""allowAtRoot"": false,
    ""allowInAreas"": true,
    ""settingsElementTypeKey"": null,
    ""groupKey"": null,
    ""areas"": null
  }
]}";
            JsonSerializerOptions options = new JsonSerializerOptions
            {

                PropertyNameCaseInsensitive = true,
                WriteIndented = true,
                Converters =
                {
                    new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
                }
            };
            var model = JsonSerializer.Deserialize<BGBlockCollectionModel>(json, JsonSerializerOptions.Web);

            Assert.That(model, Is.Not.Null);
        }
    }
}
