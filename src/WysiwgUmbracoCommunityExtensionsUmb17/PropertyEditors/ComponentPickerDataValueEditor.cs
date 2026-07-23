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
            : base(shortStringHelper, jsonSerializer, ioHelper, attribute) => Validators.Add(new ComponentPickerDataValueValidator());


        internal static IEnumerable<ComponentPickerConfigurationItem> Deserialize(IJsonSerializer jsonSerializer, object? value)
        {

            var rawJson = value is string str ? str : value?.ToString();
            if (string.IsNullOrWhiteSpace(rawJson))
            {
                yield break;
            }

            if (!rawJson.DetectIsJson())
            {
                // Old comma seperated UDI format
                foreach (var udiStr in rawJson.Split(UCore.Constants.CharArrays.Comma))
                {
                    if (UdiParser.TryParse(udiStr, out Udi? udi) && udi is GuidUdi guidUdi)
                    {
                        yield return new ComponentPickerConfigurationItem
                        {
                            Name = string.Empty,
                            Path = string.Empty
                        };
                    }
                }
            }
            else
            {
                IEnumerable<ComponentPickerConfigurationItem>? dtos =
                    jsonSerializer.Deserialize<IEnumerable<ComponentPickerConfigurationItem>>(rawJson);
                if (dtos is not null)
                {
                    // New JSON format
                    foreach (ComponentPickerConfigurationItem dto in dtos)
                    {
                        yield return dto;
                    }
                }

            }
        }
    }
}
