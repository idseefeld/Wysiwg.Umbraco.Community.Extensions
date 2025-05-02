using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using WysiwgUmbracoCommunityExtensions.Services;
using Microsoft.AspNetCore.Http;

public class UmbracoApplicationNotificationComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        _ = builder.AddNotificationHandler<UmbracoApplicationStartedNotification, UmbracoApplicationNotificationHandler>();
    }
}

public class UmbracoApplicationNotificationHandler : INotificationHandler<UmbracoApplicationStartedNotification>
{
    private readonly ILogger _logger;
    private readonly ISetupService _setupService;
    private readonly IRuntimeState _runtimeState;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UmbracoApplicationNotificationHandler(
        ILogger<UmbracoApplicationNotificationHandler> logger,
        IRuntimeState runtimeState,
        ISetupService setupService,
        IHttpContextAccessor httpContextAccessor
        )
    {
        _logger = logger;
        _runtimeState = runtimeState;
        _setupService = setupService;
        _httpContextAccessor = httpContextAccessor;
    }

    public void Handle(UmbracoApplicationStartedNotification notification)
    {
        try
        {
            if (notification.IsRestarting || _runtimeState.Level != Umbraco.Cms.Core.RuntimeLevel.Run)
            {
                return;
            }

            _logger.LogInformation("UmbracoApplicationStartedNotification _setupService.FixUpgrade()");

            var timeoutInSeconds = 10;
            var timeoutInMilliseconds = 1000 * timeoutInSeconds;
            // at this time we have no HttpContext and no user key!!!
            _setupService.FixUpgrade().Wait(timeoutInMilliseconds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to fix WYSIWYG BlockGrid content element variations");
        }
    }

}
