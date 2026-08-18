using System;
using System.Collections.Generic;
using System.Text;
using StackExchange.Profiling.Internal;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.DeliveryApi;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Routing;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Infrastructure.DeliveryApi;
using WysiwgUmbracoCommunityExtensions.Models;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ComponentPickerValueConverter(
        //IPublishedUrlProvider publishedUrlProvider,
        //IPublishedValueFallback publishedValueFallback,
        IJsonSerializer jsonSerializer
        ) : PropertyValueConverterBase
    {
        public override bool IsConverter(IPublishedPropertyType propertyType)
        {
            var rVal = propertyType.EditorAlias.Equals("Wysiwg.ComponentPicker");
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
            var rVal = typeof(ComponentPicker);
            return rVal;
        }

        public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType)
        {
            var baseLevel = base.GetPropertyCacheLevel(propertyType);
            return baseLevel != PropertyCacheLevel.None
                ? PropertyCacheLevel.Element
                : baseLevel;
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
            return typeof(ComponentPicker);
        }

        public override object? ConvertIntermediateToObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            try
            {
                if (inter is string str)
                {
                    if (!str.IsNullOrWhiteSpace())
                    {
                        return new ComponentPicker() { SelectedValue = str };// jsonSerializer.Deserialize<ComponentPicker>(str);
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }

            return null;
        }

        public object? ConvertIntermediateToDeliveryApiObject(IPublishedElement owner, IPublishedPropertyType propertyType, PropertyCacheLevel referenceCacheLevel, object? inter, bool preview)
        {
            // NOTE: eventually we might implement this explicitly instead of piggybacking on the default object conversion. however, this only happens once per cache rebuild,
            // and the performance gain from an explicit implementation is negligible, so... at least for the time being this will do just fine.
            if (ConvertIntermediateToObject(owner, propertyType, referenceCacheLevel, inter, preview) is ComponentPicker picker)
            {
                return picker;
            }

            return new ComponentPicker();
        }
    }
}
