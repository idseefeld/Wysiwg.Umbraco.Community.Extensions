using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ComponentPickerOption
    {
        [ConfigurationField("name")]
        public string? Name { get; set; }

        [ConfigurationField("value")]
        public string? Value { get; set; }

        [ConfigurationField("selected")]
        public bool Selected { get; set; }
    }
}
