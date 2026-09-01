using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_componentPicker(IPublishedElement? element, IPublishedValueFallback publishedValueFallback, IJsonSerializer jsonSerializer)
    {
        public string SelectedComponent => element?.Value<string>(publishedValueFallback, "componentPicker") ?? string.Empty;
    }
}
