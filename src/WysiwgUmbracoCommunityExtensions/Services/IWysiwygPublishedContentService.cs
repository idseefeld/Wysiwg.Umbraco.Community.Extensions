using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ColorPickerValueConverter;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface IWysiwygPublishedContentService
    {
        public string GetBackgroundColor(string contentKey);

        public string GetBackgroundColor(Guid contentKey);
    }
}
