using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.DeliveryApi;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Infrastructure.DeliveryApi;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ImageAndCropPickerValueConverter(
        IPublishedMediaCache publishedMediaCache,
        IPublishedUrlProvider publishedUrlProvider,
        IPublishedValueFallback publishedValueFallback,
        IJsonSerializer jsonSerializer,
        IApiMediaWithCropsBuilder apiMediaWithCropsBuilder
        ) : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
        {
            var rVal = propertyType.EditorAlias.Equals("Wysiwg.ImageAndCropPicker");

            return rVal;
        }

        public override bool? IsValue(object? value, PropertyValueLevel level)
        {
            var isValue = base.IsValue(value, level);
            if (isValue != false && level == PropertyValueLevel.Source)
            {
                // Empty JSON array is not a value
                isValue = value?.ToString() != "[]";
            }

            return isValue;
        }

        public override Type GetPropertyValueType(IPublishedPropertyType propertyType)
        {
            var rVal = typeof(MediaWithSelectedCrop);

            return rVal;
        }

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        {
            var baseLevel = base.GetPropertyCacheLevel(propertyType);

            return baseLevel == PropertyCacheLevel.None
                ? PropertyCacheLevel.Element
                : baseLevel;
        }

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            if (string.IsNullOrEmpty(inter?.ToString()))
            {
                // Short-circuit on empty value
                return null;
            }

            var mediaItems = new List<MediaWithSelectedCrop>();
            IEnumerable<ImageAndCropPickerModel> dtos =
                ImageAndCropPickerDataValueEditor.Deserialize(jsonSerializer, inter);

            ImageAndCropPickerConfiguration? configuration = propertyType.DataType.ConfigurationAs<ImageAndCropPickerConfiguration>();
            foreach (ImageAndCropPickerModel dto in dtos)
            {
                IPublishedContent? mediaItem = publishedMediaCache.GetById(preview, dto.MediaKey);
                if (mediaItem != null)
                {
                    var localCrops = new ImageCropperValue
                    {
                        Crops = dto.Crops,
                        FocalPoint = dto.FocalPoint,
                        Src = mediaItem.Url(publishedUrlProvider),
                    };

                    localCrops.ApplyConfiguration(configuration);

                    // TODO: HQ aims to optimize this. So check new versions v15.3.2+ for changes                    
                    var mediaWithCropsType = typeof(MediaWithSelectedCrop<>).MakeGenericType(mediaItem.GetType());
                    var mediaWithCrops = Activator.CreateInstance(mediaWithCropsType, mediaItem, publishedValueFallback, localCrops)!;
                    if (mediaWithCrops is MediaWithSelectedCrop mediaWithCropsTyped)
                    {
                        mediaWithCropsTyped.SelectedCropAlias = dto.SelectedCropAlias;
                        mediaItems.Add(mediaWithCropsTyped);
                    }

                    break;
                }
            }

            return mediaItems.FirstOrDefault();
        }

        public static PropertyCacheLevel GetDeliveryApiPropertyCacheLevel()
        {
            return PropertyCacheLevel.Elements;
        }

        public static PropertyCacheLevel GetDeliveryApiPropertyCacheLevelForExpansion()
        {
            return PropertyCacheLevel.Element;
        }

        public Type GetDeliveryApiPropertyValueType()
        {
            return typeof(IEnumerable<IApiMediaWithCrops>);
        }


        public object? ConvertIntermediateToDeliveryApiObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            IApiMediaWithCrops ToApiMedia(MediaWithCrops media) => apiMediaWithCropsBuilder.Build(media);

            // NOTE: eventually we might implement this explicitly instead of piggybacking on the default object conversion. however, this only happens once per cache rebuild,
            // and the performance gain from an explicit implementation is negligible, so... at least for the time being this will do just fine.
            var converted = ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview);

            if (converted is MediaWithCrops mediaWithCrops)
            {
                return new[] { ToApiMedia(mediaWithCrops) };
            }

            return Array.Empty<IApiMediaWithCrops>();
        }
    }
}
