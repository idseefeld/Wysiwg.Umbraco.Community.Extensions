using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ComponentPickerConfigurationEditor(IIOHelper ioHelper) : ConfigurationEditor<ComponentPickerConfiguration>(ioHelper)
    {
    }
}
