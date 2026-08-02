using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ComponentPicker
    {
        [ConfigurationField("selectedValue")]
        public string? SelectedValue { get; set; }
    }
}
