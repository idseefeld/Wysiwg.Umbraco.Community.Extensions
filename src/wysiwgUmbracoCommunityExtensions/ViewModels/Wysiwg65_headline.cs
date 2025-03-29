using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_headline
    {
        public Wysiwg65_headline() { }
        public Wysiwg65_headline(IPublishedElement? element)
        {
            var text = element?.Value<string>("text");
            Text = text != null ? new HtmlEncodedString(text) : null;
        }
        public IHtmlEncodedString? Text { get; set; }
    }
}
