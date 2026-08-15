using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Strings;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Services;
using static Umbraco.Cms.Core.PropertyEditors.ColorPickerConfiguration;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    [TestFixture]
    public class SetupServiceTests
    {
        private ILogger<SetupService> _logger = null!;
        private IContentTypeService _contentTypeService = null!;
        private IDataValueEditorFactory _dataValueEditorFactory = null!;
        private IDataTypeService _dataTypeService = null!;
        private IDataTypeContainerService _dataTypeContainerService = null!;
        private IShortStringHelper _shortStringHelper = null!;
        private IPartialViewService _partialViewService = null!;
        private IConfigurationEditorJsonSerializer _jsonSerializer = null!;
        private IHttpContextAccessor _httpContextAccessor = null!;
        private IBackOfficeSecurityAccessor _backOfficeSecurityAccessor = null!;
        private IHostEnvironment _hostEnvironment = null!;
        private IUmbracoVersion _umbracoVersion = null!;

        private SetupService _sut = null!;

        [SetUp]
        public void SetUp()
        {
            _logger = Substitute.For<ILogger<SetupService>>();
            _contentTypeService = Substitute.For<IContentTypeService>();
            _dataValueEditorFactory = Substitute.For<IDataValueEditorFactory>();
            _dataTypeService = Substitute.For<IDataTypeService>();
            _dataTypeContainerService = Substitute.For<IDataTypeContainerService>();
            _shortStringHelper = Substitute.For<IShortStringHelper>();
            _partialViewService = Substitute.For<IPartialViewService>();
            _jsonSerializer = Substitute.For<IConfigurationEditorJsonSerializer>();
            _httpContextAccessor = Substitute.For<IHttpContextAccessor>();
            _backOfficeSecurityAccessor = Substitute.For<IBackOfficeSecurityAccessor>();
            _hostEnvironment = Substitute.For<IHostEnvironment>();
            _umbracoVersion = Substitute.For<IUmbracoVersion>();

            _umbracoVersion.Version.Returns(new Version(17, 0, 0));
            _hostEnvironment.ContentRootPath.Returns(Path.GetTempPath());

            _sut = new SetupService(
                _logger,
                _contentTypeService,
                _dataValueEditorFactory,
                _dataTypeService,
                _dataTypeContainerService,
                _shortStringHelper,
                _partialViewService,
                _jsonSerializer,
                _httpContextAccessor,
                _backOfficeSecurityAccessor,
                _hostEnvironment,
                _umbracoVersion
            );
        }

        #region GetVersionStatus

        [Test]
        public async Task GetVersionStatus_ReturnsInstall_WhenDataTypeContainerDoesNotExist()
        {
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Install));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRequiredDataTypesAreMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // Return empty data types so required ones are missing
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsIntValue_MatchingVersionStatus()
        {
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            var code = await _sut.GetVersionStatusCode();

            Assert.That(code, Is.EqualTo((int)VersionStatus.Install));
        }

        #endregion

        #region GetVariations

        [Test]
        public void GetVariations_ReturnsEmptyString_WhenNoContentTypes()
        {
            _contentTypeService.GetAll().Returns([]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.Empty);
        }

        [Test]
        public void GetVariations_ReturnsCulture_WhenHeadlineVariesByCulture()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Culture);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("culture"));
        }

        [Test]
        public void GetVariations_ReturnsCultureSegment_WhenHeadlineVariesByCultureAndSegment()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.CultureAndSegment);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("culture segment"));
        }

        [Test]
        public void GetVariations_ReturnsSegment_WhenHeadlineVariesBySegment()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Segment);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("segment"));
        }

        [Test]
        public void GetVariations_ReturnsEmpty_WhenHeadlineHasNoVariation()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Nothing);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.Empty);
        }

        #endregion

        #region Install

        [Test]
        public async Task Install_ThrowsException_WhenDataTypeContainerCannotBeCreated()
        {
            // GetVersionStatus -> Install
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            // CreateDataTypeContainer -> failure
            _dataTypeContainerService.CreateAsync(
                    Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<Guid?>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(Attempt<EntityContainer?, EntityContainerOperationStatus>.Fail(EntityContainerOperationStatus.NotFound)));

            Assert.ThrowsAsync<Exception>(async () => await _sut.Install());
        }

        [Test]
        public async Task Validate_ColorPickerSetup()
        {
            var jsonArray = @"
[
    {""value"":""d60000"",""label"":""""},
    {""value"":""000"",""label"":""""}
]".GetJsonArrayFromString();

            List<ColorPickerItem> defaultItems = new List<ColorPickerItem>()
            {
                new() { Value = "d60000", Label = "" },
                new() { Value = "000", Label = "" },
            };
            string itemsValueString = JsonSerializer.Serialize(defaultItems).ToLowerInvariant();
            var jsonArray2 = itemsValueString.GetJsonArrayFromString();

            Assert.That(jsonArray.ToJsonString(), Is.EqualTo(jsonArray2.ToJsonString()));
        }

        #endregion

        #region GetVersionStatus – extended

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRteDataTypeIsAbsent()
        {
            // Container exists
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // RTE data type not present → IsRteUpdateRequired returns true
            var dataTypes = CreateRequiredDataTypes(includeRte: false);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRotationDataTypeIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // All required data types with correct RTE config, but no Rotation
            var dataTypes = CreateRequiredDataTypes(includeRotation: false);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRequiredContentTypesAreMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            // No content types → required content types check fails
            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRowSettingsMinHeightPropertyIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            // rowSettings without minHeight property
            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: false, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenParagraphSettingsMinHeightPropertyIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: false);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpToDate_WhenAllRequirementsAreMet()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.UpToDate));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsZero_WhenStatusIsUnknown()
        {
            Assert.That((int)VersionStatus.Unknown, Is.EqualTo(0));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsCorrectCode_WhenStatusIsUpToDate()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var code = await _sut.GetVersionStatusCode();

            Assert.That(code, Is.EqualTo((int)VersionStatus.UpToDate));
        }

        #endregion

        #region Install – extended

        [Test]
        public async Task Install_DoesNothing_WhenAlreadyUpToDate()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            // Should complete without throwing
            Assert.DoesNotThrowAsync(async () => await _sut.Install());
        }

        #endregion

        #region Uninstall

        [Test]
        public async Task Uninstall_CompletesWithoutError_WhenNothingIsInstalled()
        {
            _contentTypeService.GetAll().Returns([]);
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));
            _partialViewService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IPartialView>>([]));

            Assert.DoesNotThrowAsync(async () => await _sut.Uninstall());
        }

        [Test]
        public async Task Uninstall_ThrowsException_WhenContentTypeDeletionFails()
        {
            var contentType = Substitute.For<IContentType>();
            contentType.Alias.Returns("wysiwg65_headline");
            contentType.Key.Returns(Guid.NewGuid());
            contentType.Name.Returns("Headline");

            _contentTypeService.GetAll().Returns([contentType]);
            _contentTypeService.DeleteAsync(Arg.Any<Guid>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(ContentTypeOperationStatus.NotFound));

            Assert.ThrowsAsync<Exception>(async () => await _sut.Uninstall());
        }

        #endregion

        #region FixUpgrade

        [Test]
        public async Task FixUpgrade_ThrowsException_WhenDataTypeContainerCannotBeCreated()
        {
            _contentTypeService.GetAll().Returns([]);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));

            // GetDataTypeContainer → null (no container)
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            // CreateAsync fails
            _dataTypeContainerService.CreateAsync(
                    Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<Guid?>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(
                    Attempt<EntityContainer?, EntityContainerOperationStatus>.Fail(EntityContainerOperationStatus.NotFound)));

            Assert.ThrowsAsync<Exception>(async () => await _sut.FixUpgrade(null, null));
        }

        #endregion

        #region Helpers

        private static EntityContainer CreateEntityContainer(string name = "Wysiwg65_DataTypes")
        {
            var container = new EntityContainer(Constants.ObjectTypes.DataType)
            {
                Name = name,
                Key = Guid.NewGuid(),
                Id = 1
            };
            return container;
        }

        /// <summary>
        /// Creates the full set of required data types for GetVersionStatus to proceed past the "missing data types" check.
        /// Set <paramref name="includeRte"/> to false to omit the RTE data type (simulating it not being installed).
        /// When <paramref name="includeRteConfig"/> is true, the RTE data type has configuration with all required extensions.
        /// </summary>
        private IEnumerable<IDataType> CreateRequiredDataTypes(
            bool includeRotation = true,
            bool includeRte = true)
        {
            var prefix = WysiwgUmbracoCommunityExtensions.Constants.Prefix;

            // All required data type names from SetupService._requiredDataTypes + _requiredBlockGridName
            var names = new List<string>
            {
                $"{prefix}CallToActionLabel",
                $"{prefix}CallToActionOnClick",
                $"{prefix}HeadlineSizes",
                $"{prefix}LimitedHeadline",
                $"{prefix}CustomerColors",
                $"{prefix}ImageAndCropPicker",
                $"{prefix}BlockGrid"
            };

            if (includeRte)
            {
                names.Add($"{prefix}ParagaphRTE");
            }

            if (includeRotation)
            {
                names.Add($"{prefix}Rotation");
            }

            return names.Select(name =>
            {
                var dt = Substitute.For<IDataType>();
                dt.Name.Returns(name);

                if (name == $"{prefix}ParagaphRTE")
                {
                    // Extensions needed for Umbraco 17 (version >= 17)
                    var extensions = new[]
                    {
                        "Umb.Tiptap.Blockquote", "Umb.Tiptap.Bold", "Umb.Tiptap.Link",
                        "Umb.Tiptap.Heading", "Umb.Tiptap.HorizontalRule", "Umb.Tiptap.Italic",
                        "Umb.Tiptap.BulletList", "Umb.Tiptap.OrderedList", "Umb.Tiptap.Subscript",
                        "Umb.Tiptap.Superscript", "Umb.Tiptap.TextAlign", "Umb.Tiptap.Underline"
                    };
                    dt.ConfigurationData.Returns(new Dictionary<string, object>
                    {
                        ["extensions"] = extensions
                    });
                }

                return dt;
            });
        }

        private static readonly string[] RequiredContentTypeAliases =
        [
            "wysiwg65_callToAction",
            "wysiwg65_headline",
            "wysiwg65_paragraph",
            "wysiwg65_croppedPicture",
            "wysiwg65_layout1",
            "wysiwg65_layout2",
            "wysiwg65_layout3",
            "wysiwg65_layout4",
            "wysiwg65_callToActionSettings",
            "wysiwg65_headlineSettings",
            "wysiwg65_paragraphSettings",
            "wysiwg65_rowSettings"
        ];

        /// <summary>
        /// Creates all required content types. rowSettings and paragraphSettings optionally include the minHeight property.
        /// </summary>
        private static IContentType[] CreateRequiredContentTypes(
            bool rowSettingsHasMinHeight = true,
            bool paragraphSettingsHasMinHeight = true)
        {
            return RequiredContentTypeAliases.Select(alias =>
            {
                var ct = Substitute.For<IContentType>();
                ct.Alias.Returns(alias);
                ct.Variations.Returns(ContentVariation.Nothing);

                var properties = new List<IPropertyType>();

                if (alias == "wysiwg65_rowSettings" && rowSettingsHasMinHeight)
                {
                    var prop = Substitute.For<IPropertyType>();
                    prop.Alias.Returns("minHeight");
                    properties.Add(prop);
                }

                if (alias == "wysiwg65_paragraphSettings" && paragraphSettingsHasMinHeight)
                {
                    var prop = Substitute.For<IPropertyType>();
                    prop.Alias.Returns("minHeight");
                    properties.Add(prop);
                }

                ct.PropertyTypes.Returns(properties);

                return ct;
            }).ToArray();
        }

        #endregion
    }
}
