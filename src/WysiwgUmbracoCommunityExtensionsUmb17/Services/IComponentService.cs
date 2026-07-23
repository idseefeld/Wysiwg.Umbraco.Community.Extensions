using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface IComponentService
    {
        ComponentPickerConfigurationItem[] GetComponents();
    }
}