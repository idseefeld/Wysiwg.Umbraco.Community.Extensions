using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ComponentPickerConfiguration : IIgnoreUserStartNodesConfig
    {
        [ConfigurationField("items")]
        public ComponentPickerConfigurationItem[]? Items { get; set; }

        [ConfigurationField(Umbraco.Cms.Core.Constants.DataTypes.ReservedPreValueKeys.IgnoreUserStartNodes)]
        public bool IgnoreUserStartNodes { get; set; }
    }
}
