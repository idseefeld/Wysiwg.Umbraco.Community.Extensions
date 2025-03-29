using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_paragraphSettings
    {
        public Wysiwg65_paragraphSettings() { }
        public Wysiwg65_paragraphSettings(IPublishedElement? element)
        {
            Color = element?.Value<PickedColor>("color");
        }
        public PickedColor? Color { get; set; }
    }
}
