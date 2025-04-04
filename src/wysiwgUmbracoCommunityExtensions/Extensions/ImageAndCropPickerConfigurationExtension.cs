using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.PropertyEditors;
using WysiwgUmbracoCommunityExtensions.Models;
using static WysiwgUmbracoCommunityExtensions.Models.ImageAndCropPickerConfiguration;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;

namespace WysiwgUmbracoCommunityExtensions.Extensions
{
    public static class ImageAndCropPickerConfigurationExtension
    {
        //
        // Summary:
        //     Applies the configuration to ensure only valid crops are kept and have the correct
        //     width/height.
        public static void ApplyConfiguration(this ImageCropperValue imageCropperValue, ImageAndCropPickerConfiguration? configuration)
        {
            var list = new List<ImageCropperCrop>();
            CropConfigurationExtended[] array = configuration?.Crops ?? [];
            if (array != null)
            {
                var array2 = array;
                foreach (CropConfigurationExtended configuredCrop in array2)
                {
                    var imageCropperCrop = imageCropperValue.Crops?.FirstOrDefault((ImageCropperCrop x) => x.Alias == configuredCrop.Alias);
                    if (imageCropperCrop != null)
                    {
                        list.Add(new ImageCropperCrop
                        {
                            Alias = configuredCrop.Alias,
                            Width = configuredCrop.Width,
                            Height = configuredCrop.Height,
                            Coordinates = imageCropperCrop?.Coordinates
                        });
                    }
                }
            }

            imageCropperValue.Crops = list;
            if (configuration != null && !configuration.EnableLocalFocalPoint)
            {
                imageCropperValue.FocalPoint = null;
            }
        }
    }
}
