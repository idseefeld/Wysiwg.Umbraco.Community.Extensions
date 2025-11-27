using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    [DataEditor(
            "Wysiwg.ImageAndCropPicker",
            ValueType = ValueTypes.Json,
            ValueEditorIsReusable = true)]
    public class ImageAndCropPickerPropertyEditor : DataEditor
    {
        private readonly IIOHelper _ioHelper;
        public ImageAndCropPickerPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory)
        {
            _ioHelper = ioHelper;
            SupportsReadOnly = true;
        }

        public override IPropertyIndexValueFactory PropertyIndexValueFactory { get; } = new NoopPropertyIndexValueFactory();

        protected override IConfigurationEditor CreateConfigurationEditor()
        {
            return new ImageAndCropPickerConfigurationEditor(_ioHelper);
        }

        protected override IDataValueEditor CreateValueEditor()
        {
            var rVal = DataValueEditorFactory.Create<ImageAndCropPickerDataValueEditor>(Attribute!);

            return rVal;
        }
    }

}
