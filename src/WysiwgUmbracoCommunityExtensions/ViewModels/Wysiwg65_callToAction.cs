using Microsoft.AspNetCore.Html;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_callToAction
    {
        public Wysiwg65_callToAction() { }
        public Wysiwg65_callToAction(IPublishedElement? element)
        {
            var label = element?.Value<string>("label") ?? "Call To Action";
            Label = label != null ? new HtmlEncodedString(label) : null;

            Link? action = element?.Value<Link>("actionOrUrl");
            string actionUrl = action?.Url ?? "#";
            if (actionUrl.InvariantStartsWith("javascript:"))
            {
                Javascript = actionUrl["javascript:".Length..];
            }
            else
            {
                Url = actionUrl;
                Target = action?.Target;
            }
        }

        public IHtmlEncodedString? Label { get; set; }

        public string? Url { get; set; } = null;

        public string? Target { get; set; } = null;

        public string? Javascript { get; set; } = null;
    }
}
