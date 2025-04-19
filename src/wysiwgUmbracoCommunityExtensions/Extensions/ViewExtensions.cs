using System.Text;
using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using WysiwgUmbracoCommunityExtensions.ViewModels;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.Extensions
{
    public static class ViewExtensions
    {
        public static string? GetBackgroundStyle(this IPublishedElement element)
        {
            var rowSettings = new Wysiwg65_rowSettings(element);
            if (rowSettings == null)
            { return null; }

            string? colorStyle = null;
            string? imageStyle = null;
            string? paddingStyle = null;

            if (rowSettings.BackgroundColor is PickedColor color && !string.IsNullOrWhiteSpace(color.Color))
            {
                // work-a-round for missing tranparent definition in default ColorPicker data type
                var isTransparent = color.Color.InvariantEquals("#fff")
                        || (!string.IsNullOrWhiteSpace(color.Label)
                            && rowSettings.BackgroundColor.Label.InvariantEquals("transparent"));

                if (!isTransparent)
                { colorStyle = $"background-color: {color.Color};"; }
            }

            var src = rowSettings.BackgroundImage?.MediaUrl();
            if (!string.IsNullOrWhiteSpace(src))
            { imageStyle = $"background-image: url('{src}');"; }

            var padding = string.IsNullOrEmpty(rowSettings.Padding) && (colorStyle != null || imageStyle != null)
                ? "10px" : rowSettings.Padding;
            if (!string.IsNullOrEmpty(padding))
            { paddingStyle = $"padding: {padding};"; }

            return $"{paddingStyle}{colorStyle}{imageStyle}";
        }

        public static HtmlString GetHtml(this IHtmlEncodedString text)
        {
            return new HtmlString(text.ToHtmlString());
        }

        public static string GetSelectedCropUrl(this MediaWithSelectedCrop media, int width, string selectedCropAlias = "")
        {
            var cropAlias = media.SelectedCropAlias ?? selectedCropAlias ?? "";
            var src = string.IsNullOrEmpty(cropAlias)
                ? media.GetCropUrl(width: width)
                : media.GetCropUrl(width: width, cropAlias: cropAlias);
            return src ?? "";
        }
    }
}
