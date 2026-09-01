using System.Globalization;
using System.Reflection;
using Asp.Versioning;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Api.Management.Controllers;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Blocks;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using WysiwgUmbracoCommunityExtensions.ViewModels;

namespace WysiwgUmbracoCommunityExtensions.Controllers;

public partial class WysiwgApiController : ManagementApiControllerBase
{

    [ApiExplorerSettings(GroupName = "Components")]
    [HttpGet("all-components", Name = "GetAllComponents")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType<IEnumerable<ComponentPickerOption>>(StatusCodes.Status200OK)]
    public IActionResult GetAllComponents()
    {
        return Ok(componentService.GetComponents());
    }

    [ApiExplorerSettings(GroupName = "Components")]
    [HttpPost("preview-markup")]
    [MapToApiVersion("1.0")]
    [ProducesResponseType<string>(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [EndpointSummary("Gets rendered markup for block element data.")]
    //[EndpointDescription("...")]
    public async Task<IActionResult> PreviewMarkup(RequestPreviewMarkupModel request)
    {
        string markup = string.Empty;

        try
        {
            IPublishedContent? page = this.GetPublishedContentForPage(request.PageKey);

            if (page == null)
            {
                markup = "The page is not saved yet, so we can't create a preview. Save the page first.";
                return Ok(markup);
            }

            await this.SetupPublishedRequest(request.Culture, page);

            //var key = Guid.Parse("89bb2397-1aac-417f-9e1c-7f3ac0884999");// request.Data?.Key;
            //IPublishedElement owner = await GetPublishedOwnerAsync(key, page) ?? throw new InvalidOperationException("Failed to get owner for block data.");

            markup = await this.GetMarkupForBlock(page, request);
        }
        catch (Exception ex)
        {
            markup = "Something went wrong rendering a preview.";
            logger.LogError(ex, "Error rendering preview for a block");
        }

        return Ok(this.CleanUpMarkup(markup));
    }

    private async Task<string> GetMarkupForBlock(IPublishedElement owner, RequestPreviewMarkupModel request)
    {
        BlockItemData? blockData = request.Data;
        if (blockData == null || owner == null)
        {
            return string.Empty;
        }

        if (!string.IsNullOrEmpty(request.Culture))
        {
            var newCulture = new CultureInfo(request.Culture);
            if (Thread.CurrentThread.CurrentCulture != newCulture)
            {
                Thread.CurrentThread.CurrentCulture = newCulture;
                Thread.CurrentThread.CurrentUICulture = newCulture;
            }
        }

        // convert the json data to a IPublishedElement (using the built-in conversion)
        var element = blockEditorConverter.ConvertToElement(owner, blockData, PropertyCacheLevel.None, true) ?? throw new InvalidOperationException("Failed to convert block data to element.");

        // get the models builder type based on content type alias
        var blockType = typeFinder.FindClassesWithAttribute<PublishedModelAttribute>().FirstOrDefault(x =>
            x.GetCustomAttribute<PublishedModelAttribute>(false).ContentTypeAlias == element.ContentType.Alias);

        // create instance of the models builder type based from the element
        var blockInstance = Activator.CreateInstance(blockType, element, publishedValueFallback);

        // get a generic block list item type based on the models builder type
        var BlockGridItemType = typeof(BlockGridItem<>).MakeGenericType(blockType);

        // create instance of the block list item
        // if you want to use settings this will need to be changed.
        var BlockGridItem = (BlockGridItem)Activator.CreateInstance(BlockGridItemType, blockData.Key, blockInstance, null, null);
        var wysiwygBlockGridItem = new WysiwygBlockGridItem(BlockGridItem, wysiwygPublishedContentService);

        // render the partial view for the block.
        var partialName = $"/Views/Partials/blockgrid/wysiwg65/{element.ContentType.Alias}.cshtml";

        var viewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
        viewData.Model = wysiwygBlockGridItem;

        var actionContext = new ActionContext(this.HttpContext, new RouteData(), new ActionDescriptor());

        await using var sw = new StringWriter();
        var viewResult = razorViewEngine.GetView(partialName, partialName, false);

        if (viewResult?.View != null)
        {
            var viewContext = new ViewContext(actionContext, viewResult.View, viewData, new TempDataDictionary(actionContext.HttpContext, tempDataProvider), sw, new HtmlHelperOptions());
            try
            {
                await viewResult.View.RenderAsync(viewContext);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        return sw.ToString();
    }

    private async Task SetupPublishedRequest(string? culture, IPublishedContent page)
    {
        // set the published request for the page we are editing in the back office
        if (!umbracoContextAccessor.TryGetUmbracoContext(out IUmbracoContext? context) || context == null)
        {
            return;
        }

        // set the published request
        var requestBuilder = await publishedRouter.CreateRequestAsync(new Uri(Request.GetDisplayUrl()));
        requestBuilder.SetPublishedContent(page);
        context.PublishedRequest = requestBuilder.Build();

        if (page.Cultures == null)
        {
            return;
        }

        // if in a culture variant setup also set the correct language.
        var currentCulture = string.IsNullOrWhiteSpace(culture) ? page.GetCultureFromDomains() : culture;

        if (currentCulture == null || !page.Cultures.ContainsKey(currentCulture))
        {
            return;
        }

        var cultureInfo = new CultureInfo(page.Cultures[currentCulture].Culture);

        System.Threading.Thread.CurrentThread.CurrentCulture = cultureInfo;
        System.Threading.Thread.CurrentThread.CurrentUICulture = cultureInfo;
        variationContextAccessor.VariationContext = new VariationContext(cultureInfo.Name);
    }

    private IPublishedContent? GetPublishedContentForPage(Guid? pageKey)
    {
        if (!umbracoContextAccessor.TryGetUmbracoContext(out IUmbracoContext? context))
        {
            return null;
        }

        if (!pageKey.HasValue)
        {
            return null;
        }

        // Get page from published cache.
        var page = context?.Content.GetById(pageKey.Value);

        // If unpublished, then get it from preview
        page ??= context?.Content.GetById(true, pageKey.Value);

        return page;
    }

    private string CleanUpMarkup(string markup)
    {
        if (string.IsNullOrWhiteSpace(markup))
        {
            return markup;
        }

        var content = new HtmlDocument();
        content.LoadHtml(markup);

        // make sure links are not clickable in the back office, because this will prevent editing
        var links = content.DocumentNode.SelectNodes("//a");

        if (links != null)
        {
            foreach (var link in links)
            {
                link.SetAttributeValue("href", "javascript:;");
            }
        }

        return content.DocumentNode.OuterHtml;
    }
}
