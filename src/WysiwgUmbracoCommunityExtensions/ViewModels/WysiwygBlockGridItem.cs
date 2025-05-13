using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class WysiwygBlockGridItem : BlockGridItem
    {
        private readonly IWysiwygPublishedContentService? _wysiwygPublishedContentService;
        private readonly BlockGridItem _item;
        public WysiwygBlockGridItem(Guid contentKey, IPublishedElement content, Guid? settingsKey, IPublishedElement? settings) : base(contentKey, content, settingsKey, settings)
        { }

        public WysiwygBlockGridItem(BlockGridItem item,
            IWysiwygPublishedContentService wysiwygPublishedContentService)
            : base(item.ContentKey, item.Content, item.SettingsKey, item.Settings)
        {
            _wysiwygPublishedContentService = wysiwygPublishedContentService
                ?? throw new ArgumentNullException(nameof(wysiwygPublishedContentService), "WysiwygPublishedContentService must be provided.");

            _item = item ?? throw new ArgumentNullException(nameof(item), "Item cannot be null.");

            ContentKey = item.ContentKey;
            SettingsKey = item.SettingsKey;
            RowSpan = item.RowSpan;
            ColumnSpan = item.ColumnSpan;
            Areas = item.Areas;
            AreaGridColumns = item.AreaGridColumns;
            GridColumns = item.GridColumns;

            BackgroundColor = _wysiwygPublishedContentService?
                    .GetBackgroundColor(item.ContentKey.ToString());
        }
        public new IPublishedElement? Settings => _item.Settings;

        public new IPublishedElement Content => _item.Content;


        // may be used to automatically choose an inverted color
        public string? BackgroundColor { get; set; }
    }
}
