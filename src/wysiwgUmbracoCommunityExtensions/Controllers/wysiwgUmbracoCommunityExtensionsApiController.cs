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
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor
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
                var cropperConfig = cropperDataType.ConfigurationData.ContainsKey(cropsKey)
                    ? cropperDataType.ConfigurationData[cropsKey] as JsonArray
                    : null;
                var json = cropperConfig?.ToJsonString();
                if (string.IsNullOrEmpty(json))
                {
                    logger.LogWarning("No crops found in the ImageCropper data type configuration");
                    return [];
                }
                var crops = JsonSerializer.Deserialize<ImageCropperCrop[]>(json, JsonSerializerOptions.Web);
                if (crops != null)
                { rVal = crops; }
            }
            return rVal;
        }

        [HttpGet("cropurl")]
        [ProducesResponseType<string>(StatusCodes.Status200OK)]
        [ProducesResponseType<string>(StatusCodes.Status404NotFound)]
        public IActionResult CropUrl(string mediaItemId, string cropAlias = "", string selectedCrop = "", double width = 1400.0, string selectedFocalPoint = "")
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
            if (selectedCropModel != null) { localCrops.Crops = [selectedCropModel]; }
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
            url = mediaItem?.GetCropUrl(width: allowedWidth);
            return url == null ? ImageUrl(mediaItemId) : Ok(url);

            #region obsolete
            //var umbracoFile = mediaItem.GetProperty(MediaConventions.File)?.GetValue() as imageValueConverter;
            //var hasCrop = (umbracoFile?.Crops) != null && umbracoFile.Crops.FirstOrDefault(c => c.Alias.InvariantEquals(cropAlias)) != null;

            //if (selectedCropModel != null && (selectedCropModel.Coordinates != null || !string.IsNullOrEmpty(selectedCropModel.Alias)))
            //{

            //    var imageCropperValue = new imageValueConverter()
            //    {
            //        Crops = [selectedCropModel]
            //    };

            //    if (selectedCropModel.Coordinates == null)
            //    {
            //        //ToDo: change to propper values based on orig width and heigth and crop width and height etc.
            //        selectedCropModel.Coordinates = new ImageCropperCropCoordinates();
            //        switch (selectedCropModel.Width / selectedCropModel.Height)
            //        {
            //            case 1:
            //                selectedCropModel.Coordinates.X1 = (decimal)0.125;
            //                selectedCropModel.Coordinates.X2 = (decimal)0.125;
            //                break;
            //            case < 1:
            //                selectedCropModel.Coordinates.X1 = (decimal)0.5;
            //                break;
            //            case > 1:
            //                selectedCropModel.Coordinates.Y1 = (decimal)0.111042266351138;
            //                break;
            //        }
            //    }

            //    var x1 = selectedCropModel.Coordinates.X1;
            //    var x2 = selectedCropModel.Coordinates.X2;
            //    var y1 = selectedCropModel.Coordinates.Y1;
            //    var y2 = selectedCropModel.Coordinates.Y2;
            //    var hashValue = $"{mediaItem.Url()}?cc={x1},{y1},{x2},{y2}&width={allowedWidth}";// &mode={ImageCropMode.Crop}";
            //    var hash = hashValue.ToMd5();
            //    url = $"{hashValue}&v={hash}";

            //}
            //else if (hasCrop)
            //{
            //    url = mediaItem?.GetCropUrl(width: allowedWidth, cropAlias: cropAlias);
            //}
            //else
            //{
            //    logger.LogWarning("There are no crops defined on the Image data types cropper configuration! You should add: square, portrait and landscape");
            //    url = mediaItem?.GetCropUrl(width: allowedWidth);
            //}

            //return url == null ? ImageUrl(mediaItemId) : Ok(url);
            #endregion
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
            var mediaTypes = mediaTypeService.GetAll();
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
