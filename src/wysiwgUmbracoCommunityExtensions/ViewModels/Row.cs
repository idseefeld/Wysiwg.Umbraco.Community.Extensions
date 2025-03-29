using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Row
    {
        public Row() { }
        public Row(IPublishedElement? element)
        {
            BackgroundImageSrc = element?.Value<string>("backgroundImageSrc");
            BackgroundColor = element?.Value<PickedColor>("backgroundColor");
            Padding = element?.Value<string>("padding");
        }
        public string? BackgroundImageSrc { get; set; }
        public PickedColor? BackgroundColor { get; set; }
        public string? Padding { get; set; }

    }
}
