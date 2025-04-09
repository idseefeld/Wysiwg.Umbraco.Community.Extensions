using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class MediaWithSelectedCrop(IPublishedContent content, IPublishedValueFallback publishedValueFallback, ImageCropperValue localCrops) : MediaWithCrops(content, publishedValueFallback, localCrops)
    {
        //public new ImageCropperValueExtended? LocalCrops { get; }
        public string? SelectedCropAlias { get; set; }
    }
    //public class ImageCropperValueExtended : ImageCropperValue
    //{
    //    public new IEnumerable<ImageCropperCropExtended>? Crops { get; set; }
    //}
    public class MediaWithSelectedCrop<T>(T content, IPublishedValueFallback publishedValueFallback, ImageCropperValue localCrops) : MediaWithSelectedCrop(content, publishedValueFallback, localCrops)
        where T : IPublishedContent
    {
        public new T Content { get; } = content;

        public static implicit operator T(MediaWithSelectedCrop<T> mediaWithCrops) => mediaWithCrops.Content;
    }
}
