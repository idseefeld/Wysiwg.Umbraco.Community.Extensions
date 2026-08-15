using System.ComponentModel.DataAnnotations;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Cache;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Editors;
using Umbraco.Cms.Core.Models.Validation;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.PropertyEditors.Validation;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;
using Umbraco.Cms.Core.Scoping;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.Navigation;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using UCore = Umbraco.Cms.Core;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors;

/// <summary>
/// base on sealed Umbraco.Cms.Core.PropertyEditors.MediaPicker3PropertyEditor.MediaPicker3PropertyValueEditor
/// </summary>
internal sealed class ImageAndCropPickerDataValueEditor : DataValueEditor
{
    private readonly IDataTypeConfigurationCache _dataTypeReadCache;
    private readonly IJsonSerializer _jsonSerializer;
    private readonly IMediaImportService _mediaImportService;
    private readonly IMediaService _mediaService;
    private readonly ITemporaryFileService _temporaryFileService;
    private readonly ICoreScopeProvider _scopeProvider;
    private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;
    private readonly AppCaches _appCaches;

    /// <summary>
    /// Initializes a new instance of the <see cref="MediaPicker3PropertyValueEditor"/> class.
    /// </summary>
    /// <remarks>
    /// Note on <c>FromEditor()</c> and <c>ToEditor()</c> methods:
    /// The data is intentionally stored in the database as a raw JSON string without transformation.
    /// </remarks>
    /// <param name="shortStringHelper">Provides string manipulation and formatting utilities.</param>
    /// <param name="jsonSerializer">Handles JSON serialization and deserialization.</param>
    /// <param name="ioHelper">Provides IO-related helper methods.</param>
    /// <param name="attribute">The data editor attribute associated with this property editor.</param>
    /// <param name="mediaImportService">Service for importing media files.</param>
    /// <param name="mediaService">Service for managing media items.</param>
    /// <param name="temporaryFileService">Service for handling temporary files.</param>
    /// <param name="scopeProvider">Provides scope management for database operations.</param>
    /// <param name="backOfficeSecurityAccessor">Accessor for back office security context.</param>
    /// <param name="dataTypeReadCache">Cache for data type configuration.</param>
    /// <param name="localizedTextService">Service for retrieving localized text resources.</param>
    /// <param name="mediaTypeService">Service for managing media types.</param>
    /// <param name="mediaNavigationQueryService">Service for querying media navigation structures.</param>
    /// <param name="appCaches">Provides application-level caching.</param>
    public ImageAndCropPickerDataValueEditor(
     IShortStringHelper shortStringHelper,
        IJsonSerializer jsonSerializer,
        IIOHelper ioHelper,
        DataEditorAttribute attribute,
        IMediaImportService mediaImportService,
        IMediaService mediaService,
        ITemporaryFileService temporaryFileService,
        ICoreScopeProvider scopeProvider,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        IDataTypeConfigurationCache dataTypeReadCache,
        ILocalizedTextService localizedTextService,
        IMediaTypeService mediaTypeService,
        IMediaNavigationQueryService mediaNavigationQueryService,
        AppCaches appCaches)
     : base(shortStringHelper, jsonSerializer, ioHelper, attribute)
    {
        _jsonSerializer = jsonSerializer;
        _mediaImportService = mediaImportService;
        _mediaService = mediaService;
        _temporaryFileService = temporaryFileService;
        _scopeProvider = scopeProvider;
        _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        _dataTypeReadCache = dataTypeReadCache;
        _appCaches = appCaches;

        var validators = new TypedJsonValidatorRunner<List<ImageAndCropPickerModel>, ImageAndCropPickerConfiguration>(
            jsonSerializer,
            new MinMaxValidator(localizedTextService),
            new AllowedTypeValidator(localizedTextService, _mediaService, new AllowedMediaTypeHelper(mediaTypeService, appCaches)),
            new StartNodeValidator(localizedTextService, mediaNavigationQueryService));

        Validators.Add(new ImageAndCropPickerValueValidator());
    }

    internal static IEnumerable<ImageAndCropPickerModel> Deserialize(IJsonSerializer jsonSerializer, object? value)
    {
        var rawJson = value is string str ? str : value?.ToString();
        if (string.IsNullOrWhiteSpace(rawJson))
        {
            yield break;
        }

        if (!rawJson.DetectIsJson())
        {
            // Old comma seperated UDI format
            foreach (var udiStr in rawJson.Split(UCore.Constants.CharArrays.Comma))
            {
                if (UdiParser.TryParse(udiStr, out Udi? udi) && udi is GuidUdi guidUdi)
                {
                    yield return new ImageAndCropPickerModel
                    {
                        Key = Guid.NewGuid(),
                        MediaKey = guidUdi.Guid,
                        Crops = [], //Enumerable.Empty<ImageCropperValue.ImageCropperCrop>(),
                        FocalPoint = new ImageCropperValue.ImageCropperFocalPoint { Left = 0.5m, Top = 0.5m },
                        SelectedCropAlias = string.Empty,
                    };
                }
            }
        }
        else
        {
            IEnumerable<ImageAndCropPickerModel>? dtos =
                jsonSerializer.Deserialize<IEnumerable<ImageAndCropPickerModel>>(rawJson);
            if (dtos is not null)
            {
                // New JSON format
                foreach (ImageAndCropPickerModel dto in dtos)
                {
                    yield return dto;
                }
            }
        }
    }
}


/// <summary>
/// Validates the min/max configuration for the media picker property editor.
/// </summary>
internal sealed class MinMaxValidator : ITypedJsonValidator<List<ImageAndCropPickerModel>, ImageAndCropPickerConfiguration>
{
    private readonly ILocalizedTextService _localizedTextService;

    /// <summary>
    /// Initializes a new instance of the <see cref="MinMaxValidator"/> class.
    /// </summary>
    /// <param name="localizedTextService">The localized text service.</param>
    public MinMaxValidator(ILocalizedTextService localizedTextService) => _localizedTextService = localizedTextService;

    /// <inheritdoc/>
    public IEnumerable<ValidationResult> Validate(
        List<ImageAndCropPickerModel>? ImageAndCropPickerConfigurations,
        ImageAndCropPickerConfiguration? mediaPickerConfiguration,
        string? valueType,
        PropertyValidationContext validationContext)
    {
        var validationResults = new List<ValidationResult>();

        if (ImageAndCropPickerConfigurations is null || mediaPickerConfiguration is null)
        {
            return validationResults;
        }

        if (mediaPickerConfiguration.Multiple is false && ImageAndCropPickerConfigurations.Count > 1)
        {
            validationResults.Add(new ValidationResult(
                _localizedTextService.Localize("validation", "multipleMediaNotAllowed"),
                ["value"]));
        }

        if (mediaPickerConfiguration.ValidationLimit.Min is not null
            && ImageAndCropPickerConfigurations.Count < mediaPickerConfiguration.ValidationLimit.Min)
        {
            validationResults.Add(new ValidationResult(
                _localizedTextService.Localize(
                    "validation",
                    "entriesShort",
                    [mediaPickerConfiguration.ValidationLimit.Min.ToString(), (mediaPickerConfiguration.ValidationLimit.Min - ImageAndCropPickerConfigurations.Count).ToString()
                    ]),
                ["value"]));
        }

        if (mediaPickerConfiguration.ValidationLimit.Max is not null
            && ImageAndCropPickerConfigurations.Count > mediaPickerConfiguration.ValidationLimit.Max)
        {
            validationResults.Add(new ValidationResult(
                _localizedTextService.Localize(
                    "validation",
                    "entriesExceed",
                    [mediaPickerConfiguration.ValidationLimit.Max.ToString(), (ImageAndCropPickerConfigurations.Count - mediaPickerConfiguration.ValidationLimit.Max).ToString()
                    ]),
                ["value"]));
        }

        return validationResults;
    }
}

/// <summary>
/// Validates the allowed type configuration for the media picker property editor.
/// </summary>
internal sealed class AllowedTypeValidator : ITypedJsonValidator<List<ImageAndCropPickerModel>, ImageAndCropPickerConfiguration>
{
    private readonly ILocalizedTextService _localizedTextService;
    private readonly IMediaService _mediaService;
    private readonly AllowedMediaTypeHelper _allowedMediaTypeHelper;

    /// <summary>
    /// Initializes a new instance of the <see cref="AllowedTypeValidator"/> class.
    /// </summary>
    public AllowedTypeValidator(ILocalizedTextService localizedTextService, IMediaService mediaService, AllowedMediaTypeHelper allowedMediaTypeHelper)
    {
        _localizedTextService = localizedTextService;
        _mediaService = mediaService;
        _allowedMediaTypeHelper = allowedMediaTypeHelper;
    }

    /// <inheritdoc/>
    public IEnumerable<ValidationResult> Validate(
        List<ImageAndCropPickerModel>? value,
        ImageAndCropPickerConfiguration? configuration,
        string? valueType,
        PropertyValidationContext validationContext)
    {
        if (value is null || configuration is null)
        {
            return [];
        }

        HashSet<string> allowedTypeKeys = AllowedMediaTypeHelper.ParseAllowedTypeKeys(configuration.Filter);

        // No allowed types = all types are allowed
        if (allowedTypeKeys.Count == 0)
        {
            return [];
        }

        // We may or may not have explicit MediaTypeAlias values provided, depending on whether the operation is an update or a
        // create. So let's make sure we have them all.
        IEnumerable<string> providedTypeAliases = value
            .Where(x => x.MediaTypeAlias.IsNullOrWhiteSpace() is false)
            .Select(x => x.MediaTypeAlias);

        IEnumerable<Guid> retrievedMediaKeys = value
            .Where(x => x.MediaTypeAlias.IsNullOrWhiteSpace())
            .Select(x => x.MediaKey);
        IEnumerable<IMedia> retrievedMedia = _mediaService.GetByIds(retrievedMediaKeys);
        IEnumerable<string> retrievedTypeAliases = retrievedMedia
            .Select(x => x.ContentType.Alias);

        IEnumerable<string> distinctTypeAliases = providedTypeAliases.Union(retrievedTypeAliases).Distinct();

        foreach (var typeAlias in distinctTypeAliases)
        {
            if (_allowedMediaTypeHelper.IsAllowed(typeAlias, allowedTypeKeys) is false)
            {
                return
                [
                    new ValidationResult(
                            _localizedTextService.Localize("validation", "invalidMediaType"),
                            ["value"])
                ];
            }
        }

        return [];
    }
}

/// <summary>
/// Validates the start node configuration for the media picker property editor.
/// </summary>
internal sealed class StartNodeValidator : ITypedJsonValidator<List<ImageAndCropPickerModel>, ImageAndCropPickerConfiguration>
{
    private readonly ILocalizedTextService _localizedTextService;
    private readonly IMediaNavigationQueryService _mediaNavigationQueryService;

    /// <summary>
    /// Initializes a new instance of the <see cref="StartNodeValidator"/> class.
    /// </summary>
    /// <param name="localizedTextService">Service used to provide localized text for validation messages.</param>
    /// <param name="mediaNavigationQueryService">Service used to query and validate media navigation nodes.</param>
    public StartNodeValidator(
        ILocalizedTextService localizedTextService,
        IMediaNavigationQueryService mediaNavigationQueryService)
    {
        _localizedTextService = localizedTextService;
        _mediaNavigationQueryService = mediaNavigationQueryService;
    }

    /// <inheritdoc/>
    public IEnumerable<ValidationResult> Validate(
        List<ImageAndCropPickerModel>? value,
        ImageAndCropPickerConfiguration? configuration,
        string? valueType,
        PropertyValidationContext validationContext)
    {
        if (value is null || configuration?.StartNodeId is null)
        {
            return [];
        }

        if (ValidationHelper.HasValidStartNode(value.Select(x => x.MediaKey), configuration.StartNodeId.Value, _mediaNavigationQueryService) is false)
        {
            return
            [
                new ValidationResult(
                        _localizedTextService.Localize("validation", "invalidStartNode"),
                        ["value"])
            ];
        }

        return [];
    }
}
/// <summary>
/// Shared helper for checking whether a media type alias is among a set of allowed media type keys.
/// Used by both RTE and MediaPicker3 allowed-type validators.
/// </summary>
internal sealed class AllowedMediaTypeHelper
{
    private const string MediaTypeCacheKeyFormat = nameof(AllowedMediaTypeHelper) + "_MediaTypeKey_{0}";

    private readonly IMediaTypeService _mediaTypeService;
    private readonly AppCaches _appCaches;

    /// <summary>
    /// Initializes a new instance of the <see cref="AllowedMediaTypeHelper"/> class.
    /// </summary>
    /// <param name="mediaTypeService">Service for media type lookups.</param>
    /// <param name="appCaches">Application caches for request-level caching.</param>
    public AllowedMediaTypeHelper(IMediaTypeService mediaTypeService, AppCaches appCaches)
    {
        _mediaTypeService = mediaTypeService;
        _appCaches = appCaches;
    }

    /// <summary>
    /// Checks whether a media type alias resolves to one of the allowed media type keys.
    /// </summary>
    /// <param name="typeAlias">The media type alias to check.</param>
    /// <param name="allowedTypeKeys">The set of allowed media type keys (case-insensitive).</param>
    /// <returns><c>true</c> if the alias resolves to an allowed key; otherwise <c>false</c>.</returns>
    public bool IsAllowed(string typeAlias, HashSet<string> allowedTypeKeys)
    {
        var typeKey = GetMediaTypeKey(typeAlias);
        return typeKey is not null && allowedTypeKeys.Contains(typeKey);
    }

    /// <summary>
    /// Parses a comma-separated allowed types configuration string into a case-insensitive set of keys.
    /// </summary>
    /// <returns>
    /// A case-insensitive set of allowed media type keys, or an empty set if the configuration is empty or
    /// not set (meaning all types are allowed).
    /// </returns>
    public static HashSet<string> ParseAllowedTypeKeys(string? configValue)
    {
        var allowedTypes = configValue?.Split(Umbraco.Cms.Core.Constants.CharArrays.Comma, StringSplitOptions.RemoveEmptyEntries);

        if (allowedTypes is null || allowedTypes.Length == 0)
        {
            return [];
        }

        return new HashSet<string>(allowedTypes, StringComparer.OrdinalIgnoreCase);
    }

    private string? GetMediaTypeKey(string typeAlias)
    {
        string? GetMediaTypeKeyFromService(string alias) => _mediaTypeService.Get(alias)?.Key.ToString();

        if (_appCaches.RequestCache.IsAvailable is false)
        {
            return GetMediaTypeKeyFromService(typeAlias);
        }

        var cacheKey = string.Format(MediaTypeCacheKeyFormat, typeAlias);
        var typeKey = _appCaches.RequestCache.GetCacheItem<string?>(cacheKey);
        if (typeKey is null)
        {
            typeKey = GetMediaTypeKeyFromService(typeAlias);
            if (typeKey is not null)
            {
                _appCaches.RequestCache.Set(cacheKey, typeKey);
            }
        }

        return typeKey;
    }
}
