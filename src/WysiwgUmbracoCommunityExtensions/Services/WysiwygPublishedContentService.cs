using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public class WysiwygPublishedContentService(IPublishedContentQuery publishedContentQuery) : IWysiwygPublishedContentService
    {

        public static string? GetColor(PickedColor? pickedColor) { return pickedColor?.Color; }

        public static string? GetColor(string? color) { return color; }

        public string GetBackgroundColor(string contentKey)
        {
            if (string.IsNullOrEmpty(contentKey) || !Guid.TryParse(contentKey, out var guid))
            { return string.Empty; }

            return GetBackgroundColor(guid);
        }
        public string GetBackgroundColor(Guid contentKey)
        {
            var content = publishedContentQuery.Content(contentKey);
            var color = GetColor(content);
            if (string.IsNullOrEmpty(color))
            {
                color = GetColor(content?.Root());
            }
            return color ?? string.Empty;
        }
        private static string? GetColor(IPublishedContent? content)
        {
            if (content == null)
            { return null; }

            string? color = null;

            var propertyAlias = "siteBackgroundColor";
            if (content.HasProperty(propertyAlias))
            {
                var backgroundColor = content.GetProperty(propertyAlias);
                if (backgroundColor is PickedColor pickedColor)
                { color = pickedColor.Color; }
                else
                { color = backgroundColor?.GetValue()?.ToString() ?? string.Empty; }
            }

            return color;
        }
    }
}
