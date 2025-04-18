using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.IdentityModel.Tokens;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.Validators;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using UCore = Umbraco.Cms.Core;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ImageAndCropPickerDataValueEditor : DataValueEditor
    {
        public ImageAndCropPickerDataValueEditor(
         IShortStringHelper shortStringHelper,
         IJsonSerializer jsonSerializer,
         IIOHelper ioHelper,
         DataEditorAttribute attribute)
         : base(shortStringHelper, jsonSerializer, ioHelper, attribute) => Validators.Add(new ImageAndCropPickerValueValidator());

        internal static IEnumerable<ImageAndCropPickerModel> Deserialize(IJsonSerializer jsonSerializer, object? value)
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
                        yield return new ImageAndCropPickerModel
                        {
                            Key = Guid.NewGuid(),
                            MediaKey = guidUdi.Guid,
                            Crops = [], //Enumerable.Empty<ImageCropperValue.ImageCropperCrop>(),
                            FocalPoint = new ImageCropperValue.ImageCropperFocalPoint { Left = 0.5m, Top = 0.5m },
                            SelectedCropAlias = string.Empty,
                        };
                    }
                }
            }
            else
            {
                IEnumerable<ImageAndCropPickerModel>? dtos =
                    jsonSerializer.Deserialize<IEnumerable<ImageAndCropPickerModel>>(rawJson);
                if (dtos is not null)
                {
                    // New JSON format
                    foreach (ImageAndCropPickerModel dto in dtos)
                    {
                        yield return dto;
                    }
                }
            }
        }
    }
}
