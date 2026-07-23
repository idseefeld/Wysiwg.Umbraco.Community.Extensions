using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ComponentPickerConfigurationItem
    {
        [ConfigurationField("name")]
        public string? Name { get; set; }
        [ConfigurationField("path")]
        public string? Path { get; set; }
    }
}
