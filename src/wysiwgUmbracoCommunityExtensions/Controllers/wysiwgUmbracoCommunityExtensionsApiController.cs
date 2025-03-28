using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Security;
using Umbraco.Extensions;
using MediaConventions = Umbraco.Cms.Core.Constants.Conventions.Media;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensions.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "WysiwgUmbracoCommunityExtensions")]
    public class WysiwgUmbracoCommunityExtensionsApiController(
        IPublishedContentQuery publishedContent,
        ISetupService installService,
        ILogger<WysiwgUmbracoCommunityExtensionsApiController> logger,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor
        ) : WysiwgUmbracoCommunityExtensionsApiControllerBase
    {
        protected static Guid CurrentUserKey(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        => CurrentUser(backOfficeSecurityAccessor).Key;
        protected static IUser CurrentUser(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
       => backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser ?? throw new InvalidOperationException("No backoffice user found");

        [HttpGet("cropurl")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status404NotFound)]
        public IActionResult CropUrl(string mediaItemId, string? cropAlias = "", double? width = 1400)
        {
            var allowedWidth = (int)Math.Ceiling(width.GetValueOrDefault() / 100.0) * 100;
            if (allowedWidth < 10)
            { allowedWidth = 10; }
            var mediaItem = publishedContent.Media(mediaItemId);

            //ToDo: frontend resolves mediaItemId to Umbraco.Cms.Core.Models.MediaWithCrops and GetCropUrl respects localCrops. How can I achieve same behaviour here? Idea: MediaItems crop is not the same as the MediaPicker item which might has its own crop configuration. Thus I need another method ór more input parameters...

            var umbracoFile = mediaItem?.GetProperty(MediaConventions.File)?.GetValue() as Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;
            var hasCrop = (umbracoFile?.Crops) != null && umbracoFile.Crops.FirstOrDefault(c => c.Alias.InvariantEquals(cropAlias)) != null;

            string? url = null;
            if (hasCrop)
            {
                url = mediaItem?.GetCropUrl(width: allowedWidth, cropAlias: cropAlias);
            }
            else
            {
                logger.LogWarning("There are no crops definded on the Image data types cropper configuration! You should add: square, portrait and landscape");
                url = mediaItem?.GetCropUrl(width: allowedWidth);
            }

            return url == null ? ImageUrl(mediaItemId) : Ok(url);
        }

        [HttpGet("imageurl")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status404NotFound)]
        public IActionResult ImageUrl(string mediaItemId)
        {
            var mediaItem = publishedContent.Media(mediaItemId);
            var url = mediaItem?.Url();
            if (mediaItem == null || url == null)
            {
                return NotFound($"No media found for: {mediaItemId}");
            }
            return Ok(url);
        }

        [HttpGet("install")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Install()//bool resetExisting = false) //TODO: implemnet reset feature in service
        {
            try
            {
                Guid? userKey = CurrentUserKey(backOfficeSecurityAccessor);
                await installService.Install(resetExisting: false);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error installing package");
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            return Ok("Installed");
        }

        [HttpGet("uninstall")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        public IActionResult UnInstall()
        {
            try
            {
                _ = installService.Uninstall();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error uninstalling package");
                return BadRequest(ex.Message);
            }
            return Ok("Uninstalled");
        }
    }
}
