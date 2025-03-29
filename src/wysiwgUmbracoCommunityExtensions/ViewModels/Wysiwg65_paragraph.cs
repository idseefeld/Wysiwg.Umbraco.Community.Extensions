using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_paragraph
    {
        public Wysiwg65_paragraph() { }
        public Wysiwg65_paragraph(IPublishedElement? element)
        {
            Text = element?.Value<IHtmlEncodedString>("text");
        }
        public IHtmlEncodedString? Text { get; set; }
    }
}
