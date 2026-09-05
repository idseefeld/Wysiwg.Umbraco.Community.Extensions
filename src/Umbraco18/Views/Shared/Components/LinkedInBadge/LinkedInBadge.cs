using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco18.Models;
using uSync.Core.Extensions;
using WysiwgUmbracoCommunityExtensions.Attributes;

namespace Umbraco18.Views.Shared.Components.LinkedInBadge
{

    [BlockElementComponent]
    public class LinkedInBadge : ViewComponent
    {
        public async Task<IViewComponentResult>? InvokeAsync(UmbracoHelper umbracoHelper, PublishedContentModel page)
        {
            var model = new LinkedInBadgeModel();
            if (HttpContext.Request.Path.HasValue && HttpContext.Request.Path.Value.EndsWith("preview-markup"))
            {
                var previewImage = ViewComponentContext.Arguments["previewImage"] as MediaWithCrops;
                model.PreviewImage = previewImage;
                return View(model);
            }

            return View(model);
        }
    }

    public class LinkedInBadgeModel
    {
        public MediaWithCrops? PreviewImage { get; set; }
    }
}
