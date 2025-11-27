using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Threading.Tasks;

namespace WysiwgUmbracoCommunityExtensions.Extensions
{
    public static class JsonHelperExtensions
    {
        public static JsonArray GetJsonArrayFromString(this string jsonString)
        {
            var jsonDocument = JsonDocument.Parse(jsonString);
            var jsonArray = new JsonArray();
            foreach (var element in jsonDocument.RootElement.EnumerateArray())
            {
                jsonArray.Add(JsonNode.Parse(element.GetRawText()));
            }
            return jsonArray;
        }
    }
}
