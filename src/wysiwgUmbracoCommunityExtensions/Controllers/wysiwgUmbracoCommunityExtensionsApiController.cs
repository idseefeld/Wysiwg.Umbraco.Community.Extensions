using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensions.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "WysiwgUmbracoCommunityExtensions")]
    public class WysiwgUmbracoCommunityExtensionsApiController(IPublishedContentQuery publishedContent, ISetupService installService, ILogger<WysiwgUmbracoCommunityExtensionsApiController> logger) : WysiwgUmbracoCommunityExtensionsApiControllerBase
    {
        [HttpGet("cropurl")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status404NotFound)]
        public IActionResult CropUrl(string mediaItemId, string? cropAlias = "", double? width = 1400)
        {
            var allowedWidth = (int)Math.Ceiling(width.GetValueOrDefault() / 100.0) * 100;
            var mediaItem = publishedContent.Media(mediaItemId);//ToDo: frontend resolves mediaItemId to Umbraco.Cms.Core.Models.MediaWithCrops and GetCropUrl respects localCrops. How can I achieve same behaviour here?
            var url = mediaItem?.GetCropUrl(width: allowedWidth, cropAlias: cropAlias);
            if (mediaItem == null || url == null)
            {
                return NotFound($"No media found for: {mediaItemId}");
            }
            return Ok(url);
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
        public IActionResult Install()
        {
            try
            {
                installService.Install();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error installing package");
                return BadRequest(ex.Message);
            }
            return Ok("Installed");
        }

        [HttpGet("uninstall")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        public IActionResult UnInstall()
        {
            try
            {
                installService.Uninstall();
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
