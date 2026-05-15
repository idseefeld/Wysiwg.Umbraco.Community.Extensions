using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_callToActionSettings
    {
        public Wysiwg65_callToActionSettings() { }
        public Wysiwg65_callToActionSettings(IPublishedElement? element)
        {
            Color = element?.Value<PickedColor>("color")?.Color
                ?? element?.Value<string>("color");
            BackgroundColor = element?.Value<PickedColor>("backgroundColor")?.Color
                ?? element?.Value<string>("backgroundColor");
        }

        public string? Color { get; set; } = null;

        public string? BackgroundColor { get; set; } = null;
    }
}
