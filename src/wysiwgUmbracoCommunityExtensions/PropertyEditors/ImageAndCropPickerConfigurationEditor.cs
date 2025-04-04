using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ImageAndCropPickerConfigurationEditor(IIOHelper ioHelper) : ConfigurationEditor<ImageAndCropPickerConfiguration>(ioHelper) {

        //public override IDictionary<string, object> FromConfigurationEditor(IDictionary<string, object> configuration)
        //{
        //    var rVal = base.FromConfigurationEditor(configuration);

        //    return rVal;
        //}

        //public override IDictionary<string, object> FromConfigurationObject(object configuration, IConfigurationEditorJsonSerializer configurationEditorJsonSerializer)
        //{
        //    var rVal = base.FromConfigurationObject(configuration, configurationEditorJsonSerializer);

        //    return rVal;
        //}

        //public override IDictionary<string, object> ToConfigurationEditor(IDictionary<string, object> configuration)
        //{
        //    var rVal = base.ToConfigurationEditor(configuration);
        //    return rVal;
        //}
        //public override object ToConfigurationObject(IDictionary<string, object> configuration, IConfigurationEditorJsonSerializer configurationEditorJsonSerializer)
        //{
        //    var rVal = base.ToConfigurationObject(configuration, configurationEditorJsonSerializer);
        //    return rVal;
        //}
    }
}
