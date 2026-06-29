using Microsoft.Extensions.DependencyInjection;
using Umbraco.Cms.Api.Common.OpenApi;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using WysiwgUmbracoCommunityExtensions.Services;


namespace WysiwgUmbracoCommunityExtensions.Composers
{
    public class WysiwgUmbracoCommunityExtensionsApiComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Services.AddTransient<IWysiwygPublishedContentService, WysiwygPublishedContentService>();

            builder.Services.AddSingleton<ISetupService, SetupService>();

            builder.AddBackOfficeOpenApiDocument(
                Constants.ApiDocumentName,
                document => document
                    .WithTitle(Constants.ApiDocumentTitle)
                    .WithBackOfficeAuthentication());
        }
    }
}
