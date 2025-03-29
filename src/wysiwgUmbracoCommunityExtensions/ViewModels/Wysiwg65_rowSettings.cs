using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_rowSettings
    {
        public Wysiwg65_rowSettings() { }
        public Wysiwg65_rowSettings(IPublishedElement? element)
        {
            BackgroundColor = element?.Value<PickedColor>("backgroundColor");
            BackgroundImage = element?.Value<MediaWithCrops>("backgroundImage");
            Padding = element?.Value<string>("padding");
        }
        public PickedColor? BackgroundColor { get; set; }
        public MediaWithCrops? BackgroundImage { get; set; }
        public string? Padding { get; set; }
    }
}
