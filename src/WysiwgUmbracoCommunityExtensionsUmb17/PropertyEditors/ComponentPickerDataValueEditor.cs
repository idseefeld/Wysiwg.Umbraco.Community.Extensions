using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models.Editors;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using UCore = Umbraco.Cms.Core;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    internal sealed class ComponentPickerDataValueEditor : DataValueEditor
    {
        public ComponentPickerDataValueEditor(
            IShortStringHelper shortStringHelper,
            IJsonSerializer jsonSerializer,
            IIOHelper ioHelper,
            DataEditorAttribute attribute)
            : base(shortStringHelper, jsonSerializer, ioHelper, attribute)
            => Validators.Add(new ComponentPickerValueValidator());
    }
}
