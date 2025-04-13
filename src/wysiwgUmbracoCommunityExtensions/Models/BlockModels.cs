using System.Text.Json.Serialization;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class BGBlockCollectionModel
    {
        [JsonPropertyName("blocks")]
        public IEnumerable<BGBlockModel> Blocks { get; set; } = [];
    }
    public class BGBlockModel
    {
        [JsonPropertyName("contentElementTypeKey")]
        public Guid? ContentElementTypeKey { get; set; }

        [JsonPropertyName("allowAtRoot")]
        public bool AllowAtRoot { get; set; } = false;

        [JsonPropertyName("allowInAreas")]
        public bool AllowInAreas { get; set; } = false;

        [JsonPropertyName("settingsElementTypeKey")]
        public Guid? SettingsElementTypeKey { get; set; }

        [JsonPropertyName("groupKey")]
        public Guid? GroupKey { get; set; }

        [JsonPropertyName("areas")]
        public IEnumerable<BGAreaModel> Areas { get; set; } = [];
    }
    public class BGAreaModel
    {
        [JsonPropertyName("key")]
        public Guid? Key { get; set; }

        [JsonPropertyName("alias")]
        public string Alias { get; set; } = "";

        [JsonPropertyName("columnSpan")]
        public int ColumnSpan { get; set; }

        [JsonPropertyName("rowSpan")]
        public int RowSpan { get; set; }

        [JsonPropertyName("minAllowed")]
        public int MinAllowed { get; set; }

        [JsonPropertyName("specifiedAllowance")]
        public IEnumerable<BGSpecfiedAllowanceModel>? SpecifiedAllowance { get; set; }
    }
    public class BGSpecfiedAllowanceModel
    {
        [JsonPropertyName("elementTypeKey")]
        public Guid? ElementTypeKey { get; set; }

        [JsonPropertyName("minAllowed")]
        public int MinAllowed { get; set; }
    }

    public class BGBlockGroupModel
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "";

        [JsonPropertyName("key")]
        public Guid? Key { get; set; }
    }
}
