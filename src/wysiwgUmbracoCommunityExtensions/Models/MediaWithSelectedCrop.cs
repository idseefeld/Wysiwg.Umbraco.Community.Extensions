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
    public class MediaWithSelectedCrop : MediaWithCrops
    {
        public MediaWithSelectedCrop(IPublishedContent content, IPublishedValueFallback publishedValueFallback, ImageCropperValue localCrops) : base(content, publishedValueFallback, localCrops)
        {
        }

        //[JsonProperty("selectedCropAlias")]
        public string? SelectedCropAlias { get; set; }
    }
    public class MediaWithSelectedCrop<T> : MediaWithSelectedCrop
        where T : IPublishedContent
    {
        public MediaWithSelectedCrop(T content, IPublishedValueFallback publishedValueFallback, ImageCropperValue localCrops)
        : base(content, publishedValueFallback, localCrops) =>
        Content = content;

        public new T Content { get; }

        public static implicit operator T(MediaWithSelectedCrop<T> mediaWithCrops) => mediaWithCrops.Content;
    }
}
