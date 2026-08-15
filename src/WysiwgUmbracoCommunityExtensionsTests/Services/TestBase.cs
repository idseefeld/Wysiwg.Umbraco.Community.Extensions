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
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Style", "IDE1006:Naming Styles", Justification = "<Pending>")]
    public partial class TestBase
    {
        #region properties
        protected ILogger<SetupService> _logger = null!;
        protected IContentTypeService _contentTypeService = null!;
        protected IDataValueEditorFactory _dataValueEditorFactory = null!;
        protected IDataTypeService _dataTypeService = null!;
        protected IDataTypeContainerService _dataTypeContainerService = null!;
        protected IShortStringHelper _shortStringHelper = null!;
        protected IPartialViewService _partialViewService = null!;
        protected IConfigurationEditorJsonSerializer _jsonSerializer = null!;
        protected IHttpContextAccessor _httpContextAccessor = null!;
        protected IBackOfficeSecurityAccessor _backOfficeSecurityAccessor = null!;
        protected IHostEnvironment _hostEnvironment = null!;
        protected IUmbracoVersion _umbracoVersion = null!;
        protected SetupService _sut = null!;

        private const string _prefix = WysiwgUmbracoCommunityExtensions.Constants.Prefix;

        #endregion

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

        #region Helpers

        protected static EntityContainer CreateEntityContainer(string name = "Wysiwg65_DataTypes")
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
        protected IEnumerable<IDataType> CreateRequiredDataTypes(
            bool includeRotation = true,
            bool includeRte = true)
        {

            // All required data type names from SetupService._requiredDataTypes + _requiredBlockGridName
            var names = new List<string>
            {
                $"{_prefix}CallToActionLabel",
                $"{_prefix}CallToActionOnClick",
                $"{_prefix}HeadlineSizes",
                $"{_prefix}LimitedHeadline",
                $"{_prefix}CustomerColors",
                $"{_prefix}ImageAndCropPicker",
                $"{_prefix}BlockGrid",
                // v18.1.0
                $"{_prefix}ComponentPicker"
            };

            if (includeRte)
            {
                names.Add($"{_prefix}ParagaphRTE");
            }

            if (includeRotation)
            {
                names.Add($"{_prefix}Rotation");
            }

            return names.Select(name =>
            {
                var dt = Substitute.For<IDataType>();
                dt.Name.Returns(name);

                if (name == $"{_prefix}ParagaphRTE")
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

        protected static readonly string[] RequiredContentTypeAliases =
        [
            $"{_prefix}callToAction",
            $"{_prefix}headline",
            $"{_prefix}paragraph",
            $"{_prefix}croppedPicture",
            $"{_prefix}layout1",
            $"{_prefix}layout2",
            $"{_prefix}layout3",
            $"{_prefix}layout4",
            $"{_prefix}callToActionSettings",
            $"{_prefix}headlineSettings",
            $"{_prefix}paragraphSettings",
            $"{_prefix}rowSettings",
            // v18.1.0
            $"{_prefix}genericComponent"
        ];

        /// <summary>
        /// Creates all required content types. rowSettings and paragraphSettings optionally include the minHeight property.
        /// </summary>
        protected static IContentType[] CreateRequiredContentTypes(
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
