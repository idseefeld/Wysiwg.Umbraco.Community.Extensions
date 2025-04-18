using System.Text.Json;
using System.Text.Json.Nodes;
using Asp.Versioning;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using WysiwgUmbracoCommunityExtensions.Services;
using static Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;
using imageValueConverter = Umbraco.Cms.Core.PropertyEditors.ValueConverters.ImageCropperValue;
using MediaConventions = Umbraco.Cms.Core.Constants.Conventions.Media;

namespace WysiwgUmbracoCommunityExtensions.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "WysiwgUmbracoCommunityExtensions")]
    public class WysiwgUmbracoCommunityExtensionsApiController(
        IPublishedContentQuery publishedContent,
        IDataTypeService dataTypeService,
        ISetupService installService,
        IMediaTypeService mediaTypeService,
        ILogger<WysiwgUmbracoCommunityExtensionsApiController> logger,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        ISetupService setupService
        ) : WysiwgUmbracoCommunityExtensionsApiControllerBase
    {
        protected static Guid CurrentUserKey(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        { return CurrentUser(backOfficeSecurityAccessor).Key; }

        protected static IUser CurrentUser(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        {
            return backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser
                ?? throw new InvalidOperationException("No backoffice user found");
        }

        [HttpGet("crops")]
        [ProducesResponseType<IEnumerable<ImageCropperCrop>>(StatusCodes.Status200OK)]
        [ProducesResponseType<IEnumerable<ImageCropperCrop>>(StatusCodes.Status404NotFound)]
        public IActionResult Crops(string mediaItemId = "")
        {
            IEnumerable<ImageCropperCrop> rVal;

            if (string.IsNullOrEmpty(mediaItemId))
            {
                rVal = ImageCropperCrops();
            }
            else
            {
                if (publishedContent.Media(mediaItemId) is not MediaWithSelectedCrop tempItem)
                { return NotFound($"No media item found for: {mediaItemId}"); }

                MediaWithSelectedCrop mediaItem = tempItem;
                rVal = mediaItem.LocalCrops?.Crops ?? [];
            }
            return Ok(rVal);
        }

        private IEnumerable<ImageCropperCrop> ImageCropperCrops()
        {
            IEnumerable<ImageCropperCrop> rVal = [];
            var cropperDataType = dataTypeService.GetByEditorAliasAsync("Umbraco.ImageCropper").Result.FirstOrDefault();
            if (cropperDataType != null)
            {
                var cropsKey = "crops";
                var cropperConfig = cropperDataType.ConfigurationData.TryGetValue(cropsKey, out object? value) ? value as JsonArray : null;
                var json = cropperConfig?.ToJsonString();
                if (string.IsNullOrEmpty(json))
                {
                    logger.LogWarning("No crops found in the ImageCropper data type configuration");
                    return [];
                }
                var crops = JsonSerializer.Deserialize<ImageCropperCrop[]>(json, JsonSerializerOptions.Web);
                if (crops != null)
                {
                    rVal = crops.Select(c =>
                        new ImageCropperCrop
                        {
                            Alias = c.Alias,
                            Coordinates = c.Coordinates,
                            Width = c.Width,
                            Height = c.Height
                        }
                    );
                }
            }
            return rVal;
        }

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

        [HttpGet("mediatypes")]
        [ProducesResponseType<IEnumerable<IMediaType>>(StatusCodes.Status200OK)]
        [ProducesResponseType<IEnumerable<IMediaType>>(StatusCodes.Status404NotFound)]
        public IActionResult MediaTypes(string name = "")
        {
            var mediaTypes = mediaTypeService.GetAll().ToArray();
            if (string.IsNullOrEmpty(name))
            {
                return Ok(mediaTypes);
            }
            else
            {
                var requestedTypeNames = name.Split(',');
                var requestedMediaTypes = mediaTypes.Where(x => x.Name.InvariantEquals(name));
                if (requestedMediaTypes == null)
                {
                    return NotFound($"No media type found for: {name}");
                }
                return Ok(requestedMediaTypes);
            }
        }

        [HttpGet("v2-cropurl")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status404NotFound)]
        public IActionResult V2CropUrl(string mediaItemId, string cropAlias = "", string selectedCrop = "", double width = 1400.0, string selectedFocalPoint = "")
        {
            if (string.IsNullOrEmpty(mediaItemId))
            {
                return NotFound("No media item id provided");
            }
            var tempItem = publishedContent.Media(mediaItemId);
            if (tempItem == null)
            {
                return NotFound($"No media item found for: {mediaItemId}");
            }
            ImageCropperCrop? selectedCropModel = null;
            ImageCropperFocalPoint? focalPoint = null;
            if (!string.IsNullOrEmpty(selectedCrop))
            {
                try
                {
                    selectedCropModel = JsonSerializer.Deserialize<ImageCropperCrop>(selectedCrop, JsonSerializerOptions.Web);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error deserializing selected crop: {Message}", ex.Message);
                }
            }
            if (!string.IsNullOrEmpty(selectedFocalPoint))
            {
                try
                {
                    focalPoint = JsonSerializer.Deserialize<ImageCropperFocalPoint>(selectedFocalPoint, JsonSerializerOptions.Web);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error deserializing selected focal point: {Message}", ex.Message);
                }
            }
            string? url = null;
            var localCrops = new ImageCropperValue();
            if (selectedCropModel != null)
            { localCrops.Crops = [selectedCropModel]; }
            localCrops.FocalPoint = focalPoint;

            var mediaItem = new MediaWithCrops(tempItem, new NoopPublishedValueFallback(), localCrops);

            var allowedWidth = (int)Math.Ceiling(width / 100.0) * 100;
            if (allowedWidth < 10)
            { allowedWidth = 10; }

            if (mediaItem is MediaWithCrops croppedMedia)
            {
                url = croppedMedia.GetCropUrl(width: allowedWidth, cropAlias: cropAlias);
                if (!string.IsNullOrEmpty(url))
                { return Ok(url); }
            }

            logger.LogWarning("No crops found ");
            url = mediaItem?.GetCropUrl(width: allowedWidth, cropAlias: cropAlias);
            return url == null ? ImageUrl(mediaItemId) : Ok(url);
        }

        // I could not figure out how to use the VersionStatus enum in Typescript
        //[HttpGet("updateStatus")]
        //[ProducesResponseType<VersionStatus>(StatusCodes.Status200OK)]
        //[ProducesResponseType<VersionStatus>(StatusCodes.Status500InternalServerError)]
        //public async Task<IActionResult> GetUpdateStatus()
        //{
        //    try
        //    {
        //        var version = await setupService.GetVersionStatus();
        //        return Ok(version);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.LogError(ex, "Error checking version");
        //        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //    }
        //}

        [HttpGet("updateStatusCode")]
        [ProducesResponseType<int>(StatusCodes.Status200OK)]
        [ProducesResponseType<int>(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUpdateStatusCode()
        {
            try
            {
                var code = await setupService.GetVersionStatusCode();
                return Ok(code);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error checking version");
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
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

                Thread.Sleep(500);
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
