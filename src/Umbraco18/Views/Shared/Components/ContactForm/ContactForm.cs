using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco18.Models;
using WysiwgUmbracoCommunityExtensions.Attributes;

namespace Umbraco18.Views.Shared.Components.ContactForm;

[BlockElementComponent]
public class ContactForm : ViewComponent
{
    public async Task<IViewComponentResult>? InvokeAsync(UmbracoHelper umbracoHelper, PublishedContentModel page)
    {
        var contactFormModel = new ContactFormModel();

        return View(contactFormModel);
    }
}
