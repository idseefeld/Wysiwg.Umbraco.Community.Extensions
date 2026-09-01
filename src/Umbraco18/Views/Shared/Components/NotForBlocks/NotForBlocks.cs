using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco18.Models;

namespace Umbraco18.Views.Shared.Components.NotForBlocks
{
    public class NotForBlocks : ViewComponent
    {
        public async Task<IViewComponentResult>? InvokeAsync(UmbracoHelper umbracoHelper, PublishedContentModel page)
        {
            return View("Default", "Not for blocks");
        }
    }
}
