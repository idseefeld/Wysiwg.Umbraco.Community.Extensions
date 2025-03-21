using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace wysiwgUmbracoCommunityExtensions.TestSite.Extensions
{
    public static class CustomBlockGridTemplateExtensions
    {
        public const string DefaultFolder = BlockGridTemplateExtensions.DefaultFolder;

        public const string DefaultTemplate = BlockGridTemplateExtensions.DefaultTemplate;

        public const string DefaultItemsTemplate = BlockGridTemplateExtensions.DefaultItemsTemplate;

        public const string DefaultItemAreasTemplate = BlockGridTemplateExtensions.DefaultItemAreasTemplate;

        public const string DefaultItemAreaTemplate = BlockGridTemplateExtensions.DefaultItemAreaTemplate;

        //
        // Summary:
        //     Renders a block grid model into a grid layout
        //
        // Remarks:
        //     This is primarily a copy of Umbraco.Extensions.BlockGridTemplateExtensions

        //     By default this method uses a set of built-in partial views for rendering the
        //     blocks and areas in the grid model. These partial views are embedded in the static
        //     assets (Umbraco.Cms.StaticAssets), so they won't show up in the Views folder
        //     on your local disk. If you need to tweak the grid rendering output, you can copy
        //     the partial views from GitHub to your local disk. The partial views are found
        //     in "/src/Umbraco.Cms.StaticAssets/Views/Partials/blockgrid/" on GitHub and should
        //     be copied to "Views/Partials/BlockGrid/" on your local disk.
        public static async Task<IHtmlContent> GetBlockGridHtmlAsync(this IHtmlHelper html, BlockGridModel? model, string template = "default")
        {
            if (model != null && model.Count == 0)
            {
                return new HtmlString(string.Empty);
            }

            return await html.PartialAsync(DefaultFolderTemplate(template), model);
        }

        public static async Task<IHtmlContent> GetBlockGridHtmlAsync(this IHtmlHelper html, IPublishedProperty property, string template = "default")
        {
            return await html.GetBlockGridHtmlAsync(property.GetValue() as BlockGridModel, template);
        }

        public static async Task<IHtmlContent> GetBlockGridHtmlAsync(this IHtmlHelper html, IPublishedContent contentItem, string propertyAlias)
        {
            return await html.GetBlockGridHtmlAsync(contentItem, propertyAlias, "default");
        }

        public static async Task<IHtmlContent> GetBlockGridHtmlAsync(this IHtmlHelper html, IPublishedContent contentItem, string propertyAlias, string template)
        {
            IPublishedProperty requiredProperty = GetRequiredProperty(contentItem, propertyAlias);
            return await html.GetBlockGridHtmlAsync(requiredProperty.GetValue() as BlockGridModel, template);
        }

        public static async Task<IHtmlContent> GetBlockGridItemsHtmlAsync(this IHtmlHelper html, IEnumerable<BlockGridItem> items, string template = "items")
        {
            return await html.PartialAsync(DefaultFolderTemplate(template), items);
        }

        public static async Task<IHtmlContent> GetBlockGridItemAreasHtmlAsync(this IHtmlHelper html, BlockGridItem item, string template = "areas")
        {
            return await html.PartialAsync(DefaultFolderTemplate(template), item);
        }

        public static async Task<IHtmlContent> GetBlockGridItemAreaHtmlAsync(this IHtmlHelper html, BlockGridArea area, string template = "area")
        {
            return await html.PartialAsync(DefaultFolderTemplate(template), area);
        }

        public static async Task<IHtmlContent> GetBlockGridItemAreaHtmlAsync(this IHtmlHelper html, BlockGridItem item, string areaAlias, string template = "area")
        {
            string areaAlias2 = areaAlias;
            BlockGridArea? blockGridArea = item.Areas.FirstOrDefault((a) => a.Alias == areaAlias2);
            if (blockGridArea == null)
            {
                return new HtmlString(string.Empty);
            }

            return await html.GetBlockGridItemAreaHtmlAsync(blockGridArea, template);
        }

        public static IHtmlContent GetBlockGridHtml(this IHtmlHelper html, BlockGridModel? model, string template = "default")
        {
            if (model != null && model.Count == 0)
            {
                return new HtmlString(string.Empty);
            }

            return html.Partial(DefaultFolderTemplate(template), model);
        }

        public static IHtmlContent GetBlockGridHtml(this IHtmlHelper html, IPublishedProperty property, string template = "default")
        {
            return html.GetBlockGridHtml(property.GetValue() as BlockGridModel, template);
        }

        public static IHtmlContent GetBlockGridHtml(this IHtmlHelper html, IPublishedContent contentItem, string propertyAlias)
        {
            return html.GetBlockGridHtml(contentItem, propertyAlias, "default");
        }

        public static IHtmlContent GetBlockGridHtml(this IHtmlHelper html, IPublishedContent contentItem, string propertyAlias, string template)
        {
            IPublishedProperty requiredProperty = GetRequiredProperty(contentItem, propertyAlias);
            return html.GetBlockGridHtml(requiredProperty.GetValue() as BlockGridModel, template);
        }

        public static IHtmlContent GetBlockGridItemsHtml(this IHtmlHelper html, IEnumerable<BlockGridItem> items, string template = "items")
        {
            return html.Partial(DefaultFolderTemplate(template), items);
        }

        public static IHtmlContent GetBlockGridItemAreasHtml(this IHtmlHelper html, BlockGridItem item, string template = "areas")
        {
            return html.Partial(DefaultFolderTemplate(template), item);
        }

        public static IHtmlContent GetBlockGridItemAreaHtml(this IHtmlHelper html, BlockGridArea area, string template = "area")
        {
            return html.Partial(DefaultFolderTemplate(template), area);
        }

        public static IHtmlContent GetBlockGridItemAreaHtml(this IHtmlHelper html, BlockGridItem item, string areaAlias, string template = "area")
        {
            string areaAlias2 = areaAlias;
            BlockGridArea? blockGridArea = item.Areas.FirstOrDefault((a) => a.Alias == areaAlias2);
            if (blockGridArea == null)
            {
                return new HtmlString(string.Empty);
            }

            return html.GetBlockGridItemAreaHtml(blockGridArea, template);
        }

        private static string DefaultFolderTemplate(string template)
        {
            return string.Concat(DefaultFolder, template);
        }

        private static IPublishedProperty GetRequiredProperty(IPublishedContent contentItem, string propertyAlias)
        {
            ArgumentNullException.ThrowIfNull(propertyAlias, nameof(propertyAlias));
            if (string.IsNullOrWhiteSpace(propertyAlias))
            {
                throw new ArgumentException("Value can't be empty or consist only of white-space characters.", "propertyAlias");
            }

            return contentItem.GetProperty(propertyAlias) ?? throw new InvalidOperationException("No property type found with alias " + propertyAlias);
        }
    }

}
