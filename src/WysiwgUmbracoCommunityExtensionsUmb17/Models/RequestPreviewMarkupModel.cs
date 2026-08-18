using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;
using Umbraco.Cms.Core.Models.Blocks;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class RequestPreviewMarkupModel
    {
        [JsonPropertyName("data")]
        public BlockItemData? Data { get; set; }

        [JsonPropertyName("pageKey")]
        public Guid? PageKey{ get; set; }

        [JsonPropertyName("culture")]
        public string? Culture { get; set; }

    }
}
