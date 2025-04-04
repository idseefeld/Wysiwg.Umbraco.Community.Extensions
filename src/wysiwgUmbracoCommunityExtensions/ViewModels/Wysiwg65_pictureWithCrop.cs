using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_pictureWithCrop
    {
        public Wysiwg65_pictureWithCrop() { }

        public Wysiwg65_pictureWithCrop(IPublishedElement? element) {
            MediaItem = element?.Value<MediaWithSelectedCrop>("mediaItem");
            AlternativeText = element?.Value<string>("alternativeText");
            FigCaption = element?.Value<string>("figCaption");
            CropAlias = element?.Value<string>("cropAlias");
            CaptionColor = element?.Value<PickedColor>("captionColor");
        }

        public MediaWithSelectedCrop? MediaItem { get; set; }
        public string? AlternativeText { get; set; }
        public string? FigCaption { get; set; }
        public PickedColor? CaptionColor { get; set; }
        public string? CropAlias { get; set; }
    }
}
