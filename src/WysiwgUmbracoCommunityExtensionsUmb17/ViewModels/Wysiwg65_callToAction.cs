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

            string action = element?.Value<Link>("actionOrUrl")?.Url ?? "#";
            if (action.InvariantStartsWith("javascript:"))
            {
                Javascript = action["javascript:".Length..];
            }
            else
            {
                Url = action;
                External = bool.Parse(element?.Value<string>("target") ?? "false");
            }
        }

        public IHtmlEncodedString? Label { get; set; }

        public string? Url { get; set; } = null;

        public bool External { get; set; } = false;

        public string? Javascript { get; set; } = null;
    }
}
