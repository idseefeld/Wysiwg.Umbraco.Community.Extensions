using System.Text;
using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
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

            var backgroundColor = rowSettings.BackgroundColor;
            var row = new Row
            {
                BackgroundColor = backgroundColor,
                BackgroundImageSrc = rowSettings.BackgroundImage?.MediaUrl(),
                Padding = rowSettings.Padding
            };
            var style = new StringBuilder();
            var pickedColor = row.BackgroundColor;
            if (!string.IsNullOrWhiteSpace(pickedColor?.Color) && !pickedColor.Color.InvariantEquals("#fff")
                && (string.IsNullOrWhiteSpace(pickedColor?.Label) || !pickedColor.Label.InvariantEquals("transparent")))
            {
                _ = style.Append($"background-color: {pickedColor?.Color};");
            }
            if (!string.IsNullOrWhiteSpace(row.BackgroundImageSrc))
            {
                _ = style.Append($"background-image: url('{row.BackgroundImageSrc}');");
            }
            if (!string.IsNullOrWhiteSpace(row.Padding))
            {
                _ = style.Append($"padding: {row.Padding};");
            }
            return style.ToString();
        }

        public static HtmlString GetHtml(this IHtmlEncodedString text)
        {
            return new HtmlString(text.ToHtmlString());
        }
    }
}
