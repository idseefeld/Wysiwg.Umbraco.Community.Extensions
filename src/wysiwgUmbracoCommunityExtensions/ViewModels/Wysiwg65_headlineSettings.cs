using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_headlineSettings
    {
        public Wysiwg65_headlineSettings() { }
        public Wysiwg65_headlineSettings(IPublishedElement? element)
        {
            Color = element?.Value<PickedColor>("color");
            Size = element?.Value<string>("size");
            Margin = element?.Value<string>("margin");
        }
        public PickedColor? Color { get; set; }
        public string? Size { get; set; }
        public string? Margin { get; set; }
    }
}
