using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    /// <summary>
    /// Add as transient to the DI container. See: ..\Composers\wysiwgUmbracoCommunityExtensionsApiComposer.cs
    /// </summary>
    /// <param name="publishedContentQuery"></param>
    public class WysiwygPublishedContentService(IPublishedContentQuery publishedContentQuery, AppCaches appCaches) : IWysiwygPublishedContentService
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
            return GetBackgroundColorInternal(contentKey);
        }
        public string GetSiteBackgroundColor(string contentKey)
        {
            if (string.IsNullOrEmpty(contentKey) || !Guid.TryParse(contentKey, out var guid))
            { return string.Empty; }

            return GetSiteBackgroundColor(guid);
        }
        public string GetSiteBackgroundColor(Guid contentKey)
        {
            return GetBackgroundColorInternal(contentKey, true);
        }

        private string GetBackgroundColorInternal(Guid contentKey, bool rootOnly = false)
        {
            var color = string.Empty;

            if (contentKey == Guid.Empty)
            { return color; }

            var content = publishedContentQuery.Content(contentKey);
            if (content == null)
            { return color; }

            if (rootOnly)
            {
                color = GetColorByPropertyAlias(content.Root(), "siteBackgroundColor");
            }
            else
            {
                color = GetColorByPropertyAlias(content, "pageBackgroundColor");
                if (string.IsNullOrEmpty(color))
                {
                    color = GetColorByPropertyAlias(content.Root(), "siteBackgroundColor");
                }
            }

            return color ?? string.Empty;
        }

        private string GetColorByPropertyAlias(IPublishedContent content, string propertyAlias)
        {
            string? color = appCaches.RequestCache.GetCacheItem(
                $"WysiwygPublishedContentService.GetColorByPropertyAlias-{content.Key}-{propertyAlias}",
                () => GetColorByPropertyAliasInternal(content, propertyAlias));

            return color ?? string.Empty;
        }
        private static string GetColorByPropertyAliasInternal(IPublishedContent content, string propertyAlias)
        {
            string color = string.Empty;
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
