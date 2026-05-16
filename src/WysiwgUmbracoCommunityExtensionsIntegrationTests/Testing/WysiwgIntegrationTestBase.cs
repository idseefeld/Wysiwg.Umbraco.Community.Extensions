using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Tests.Common.Testing;
using Umbraco.Cms.Tests.Integration.Testing;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensionsIntegrationTests.Testing;

/// <summary>
///     Base class for WysiwgUmbracoCommunityExtensions integration tests.
///     Boots a real Umbraco host backed by an in-process SQLite database and
///     registers the package services under test.
/// </summary>
[UmbracoTest(Database = UmbracoTestOptions.Database.NewSchemaPerTest)]
public abstract class WysiwgIntegrationTestBase : UmbracoIntegrationTest
{
    protected ISetupService SetupService => GetRequiredService<ISetupService>();
    protected IDataTypeService DataTypeService => GetRequiredService<IDataTypeService>();
    protected IDataTypeContainerService DataTypeContainerService => GetRequiredService<IDataTypeContainerService>();
    protected IContentTypeService ContentTypeService => GetRequiredService<IContentTypeService>();
    protected IPartialViewService PartialViewService => GetRequiredService<IPartialViewService>();

    protected override void CustomTestSetup(IUmbracoBuilder builder)
    {
        builder.Services.AddSingleton<ISetupService, SetupService>();
        builder.Services.AddTransient<IWysiwygPublishedContentService, WysiwygPublishedContentService>();
    }

    protected override void ConfigureTestServices(IServiceCollection services)
    {
        // SetupService resolves the acting user via IBackOfficeSecurityAccessor.
        // In the integration test host there is no HTTP context, so we supply a
        // mock that returns the built-in super user key so all service calls are
        // authorised.
        var superUser = new Mock<IUser>();
        superUser.Setup(u => u.Key).Returns(Constants.Security.SuperUserKey);

        var backOfficeSecurity = new Mock<IBackOfficeSecurity>();
        backOfficeSecurity.Setup(s => s.CurrentUser).Returns(superUser.Object);

        var accessor = new Mock<IBackOfficeSecurityAccessor>();
        accessor.Setup(a => a.BackOfficeSecurity).Returns(backOfficeSecurity.Object);

        services.AddSingleton(accessor.Object);
    }

    protected override void SetUpTestConfiguration(IConfigurationBuilder configBuilder)
    {
        if (global::WysiwgGlobalSetupTeardown.TestConfiguration is not null)
        {
            configBuilder.AddConfiguration(global::WysiwgGlobalSetupTeardown.TestConfiguration);
        }
    }
}
