using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ImageAndCropPickerConfigurationEditor(IIOHelper ioHelper) : ConfigurationEditor<ImageAndCropPickerConfiguration>(ioHelper) { }
}
