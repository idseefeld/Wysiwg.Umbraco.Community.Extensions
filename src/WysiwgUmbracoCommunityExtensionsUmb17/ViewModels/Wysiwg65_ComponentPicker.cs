using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_ComponentPicker
    {
        public Wysiwg65_ComponentPicker() { }
        public Wysiwg65_ComponentPicker(IPublishedElement? element)
        {
            SelectedComponent = element?
                .Value<IEnumerable<ComponentPicker>>("componentPicker")?
                .FirstOrDefault();
        }
        public ComponentPicker? SelectedComponent { get; set; }
    }
}
