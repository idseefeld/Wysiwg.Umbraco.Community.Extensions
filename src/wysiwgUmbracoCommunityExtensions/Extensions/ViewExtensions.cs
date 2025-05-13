using System.Text;
using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using WysiwgUmbracoCommunityExtensions.Services;
using WysiwgUmbracoCommunityExtensions.ViewModels;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.Extensions
{
    public static class ViewExtensions
    {
        public static string? GetBackgroundStyle(this IPublishedElement element, string? pageColor = null)
        {
            var rowSettings = new Wysiwg65_rowSettings(element);
            if (rowSettings == null)
            { return null; }

            string? colorStyle = rowSettings.BackgroundColor is PickedColor color ? $"background-{color.GetColorStyle(pageColor)}" : null;
            string? imageStyle = null;
            string? paddingStyle = null;
            string? minHeightStyle = null;

            if (!string.IsNullOrEmpty(rowSettings.MinHeight))
            { minHeightStyle = $"min-height: {rowSettings.MinHeight};"; }

            var src = rowSettings.BackgroundImage?.MediaUrl();
            if (!string.IsNullOrWhiteSpace(src))
            { imageStyle = $"background-repeat:no-repeat;background-position:inherit;background-image: url('{src}');"; }

            var padding = string.IsNullOrEmpty(rowSettings.Padding) && (colorStyle != null || imageStyle != null)
                ? "10px" : rowSettings.Padding;
            if (!string.IsNullOrEmpty(padding))
            { paddingStyle = $"padding: {padding};"; }

            return $"{paddingStyle}{colorStyle}{imageStyle}{minHeightStyle}";
        }
        public static string? GetColorStyle(this PickedColor color, string? pageColor = null)
        {
            string? colorStyle = null;

            var colorValue = string.IsNullOrEmpty(color.Color)
                ? pageColor
                : color.Color;
            var colorLabel = string.IsNullOrEmpty(color.Label)
                ? string.Empty
                : color.Label;

            if (!string.IsNullOrWhiteSpace(colorValue))
            {
                // work-a-round for missing tranparent definition in default ColorPicker data type
                var isTransparent = colorValue.InvariantEquals("#fff")
                        || (!string.IsNullOrWhiteSpace(colorLabel)
                            && colorLabel.InvariantEquals("transparent"));
                if (!isTransparent)
                { colorStyle = $"color: {colorValue};"; }
            }

            return colorStyle;
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
