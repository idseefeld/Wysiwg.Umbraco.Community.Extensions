using System.Text;
using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Web.Common.PublishedModels;
using WysiwgUmbracoCommunityExtensions.TestSite.Models;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensions.TestSite.Extensions
{
    public static class ViewExtensions
    {
        public static string? GetBackgroundStyle(this IPublishedElement settings)
        {
            if (settings is not Wysiwg65_rowSettings rowSettings)
            { return null; }

            var row = new Row
            {
                BackgroundColor = new PickerColor()
                {
                    Color = WysiwygPublishedContentService.GetColor(rowSettings.BackgroundColor) ?? string.Empty
                },
                BackgroundImageSrc = rowSettings?.BackgroundImage?.MediaUrl()
            };

            var style = new StringBuilder();
            var pickerColor = row.BackgroundColor;
            if (!string.IsNullOrWhiteSpace(pickerColor?.Color) && !pickerColor.Color.InvariantEquals("#fff")
                && (string.IsNullOrWhiteSpace(pickerColor?.Label) || !pickerColor.Label.InvariantEquals("transparent")))
            {
                _ = style.Append($"background-color: {pickerColor?.Color};");
            }
            if (!string.IsNullOrWhiteSpace(row.BackgroundImageSrc))
            {
                _ = style.Append($"background-image: url('{row.BackgroundImageSrc}');");
            }
            return style.ToString();
        }

        public static HtmlString GetHtml(this IHtmlEncodedString text)
        {
            return new HtmlString(text.ToHtmlString());
        }

    }
}
