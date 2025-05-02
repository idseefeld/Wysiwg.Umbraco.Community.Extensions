using System.IO;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using StackExchange.Profiling.Internal;
using Umbraco.Cms.Api.Management.ViewModels.DataType;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Strings;
using Umbraco.Cms.Web.Common.Security;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
using static Umbraco.Cms.Core.Services.OperationResult;
using uReferenceByIdModel = Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public enum VersionStatus
    {
        Unknown,
        UpToDate,
        Update,
        Install
    }
    public class SetupService(
        ILogger<SetupService> logger,
        IContentTypeService contentTypeService,
        IDataValueEditorFactory dataValueEditorFactory,
        IDataTypeService dataTypeService,
        IDataTypeContainerService dataTypeContainerService,
        IShortStringHelper shortStringHelper,
        IPartialViewService partialViewService,
        IConfigurationEditorJsonSerializer jsonSerializer,
        IHttpContextAccessor httpContextAccessor,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor
        ) : ISetupService
    {
        #region properties
        private bool _resetExisting = false;
        private const string ErrorMsgPrefix = "Error during installation of WYSIWG Umbraco Community Extensions:";
        private readonly string _errorMsgDataTypeNotFoundStart = $"{ErrorMsgPrefix} Could not find data type:";
        private readonly string _errorMsgUpdateContentTypeStart = $"{ErrorMsgPrefix} Could not update content type";
        private readonly string _contentElementsRootContainer = $"{Constants.Prefix.ToFirstUpper()}Content Elements";

        private readonly string[] _requiredContentTypes = [
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}croppedPicture",
            $"{Constants.Prefix}layout1",
            $"{Constants.Prefix}layout2",
            $"{Constants.Prefix}layout3",
            $"{Constants.Prefix}layout4",
            $"{Constants.Prefix}headlineSettings",
            $"{Constants.Prefix}paragraphSettings",
            $"{Constants.Prefix}rowSettings"
        ];
        private readonly string[] _needUpdateContentTypes = [
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}croppedPicture"
        ];
        private string[] _depricatedContentTypes = [];
        private readonly string _dtContainerName = $"{Constants.Prefix.ToFirstUpper()}DataTypes";
        private readonly string[] _requiredDataTypes = [
            $"{Constants.Prefix}HeadlineSizes",
            $"{Constants.Prefix}LimitedHeadline",
            $"{Constants.Prefix}ParagaphRTE",
            $"{Constants.Prefix}CustomerColors",
            $"{Constants.Prefix}ImageAndCropPicker"
        ];
        // Do not remove previus data types without deprication phase and documentation
        private readonly string[] _removedDataTypes = [
            //$"{Constants.Prefix}ImageMediaPicker",
            //$"{Constants.Prefix}CropNames"
        ];

        private readonly string _requiredBlockGridName = $"{Constants.Prefix}BlockGrid";
        private const string BlockElementsName = "Block Elements";
        private const string BlockLayoutsName = "Block Layouts";
        private const string BlockSettingsName = "Block Settings";
        private const string DepricatedElementsName = "Depricated Elements";
        private readonly string[] _level2ContainerNames = [BlockElementsName, BlockLayoutsName, BlockSettingsName];
        private readonly Dictionary<string, EntityContainer> _blockContainers = [];

        //private Guid? _userKey = CurrentUserKey;
        private IContentType[] _allContentTypes = [];
        private IDataType[] _existingDataTypes = [];
        private EntityContainer? _dataTypeContainer;

        private bool _isInstalling = false;
        private bool _isUninstalling = false;
        #endregion

        #region install
        public async Task Install(bool resetExisting = false)
        {
            try
            {
                var versionStatus = await GetVersionStatus();
                if (_isInstalling || _isUninstalling || versionStatus == VersionStatus.UpToDate)
                { return; }

                _isInstalling = true;
                _resetExisting = resetExisting;

                _dataTypeContainer ??= (await CreateDataTypeContainer())
                    ?? throw new Exception($"{ErrorMsgPrefix} Could not find data type container.");

                var parent = uReferenceByIdModel.ReferenceOrNull(_dataTypeContainer?.Key)
                    ?? throw new Exception($"{ErrorMsgPrefix} could not get ReferenceByIdModel for {_dataTypeContainer?.Name}!");


                var pictureWithCropElement = contentTypeService.Get($"{Constants.Prefix}pictureWithCrop");
                if (!string.IsNullOrEmpty(pictureWithCropElement?.Alias))
                {
                    _depricatedContentTypes = [pictureWithCropElement.Alias];
                }

                await CreateOrUpdateDataTypesForBlockElements(parent);

                await CreateBlockElements();

                await CreateDataTypeBlockGrid(parent);

                await RemoveDataTypes();

                await SwitchPartialViews();

                CompleteUpdate();

                logger.LogInformation("Successfully installed of WYSIWG Umbraco Community Extensions.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Installation of WYSIWG Umbraco Community Extensions failded.");
                throw;
            }
            finally
            {
                _existingDataTypes = [];
                _dataTypeContainer = null;
                _isInstalling = false;
            }
        }

        #region miscellaneous
        private void CompleteUpdate()
        {

            //ToDo: use package migrations
        }

        public async Task<VersionStatus> GetVersionStatus()
        {
            //ToDo: use package migrations

            _dataTypeContainer ??= await GetDataTypeContainer();
            var install = _dataTypeContainer == null;
            if (install)
            { return VersionStatus.Install; }

            var allRequiredDataTypes = new List<string>(_requiredDataTypes) { _requiredBlockGridName };
            _existingDataTypes = await GetAllWysiwgDataTypes();
            var notAllRequiredInstalled = allRequiredDataTypes.Any(d => _existingDataTypes.FirstOrDefault(e => e.Name != null && e.Name.Equals(d)) == null);
            if (notAllRequiredInstalled)
            { return VersionStatus.Update; }

            UpdateContentTypes();
            var requiredContentTypes = _allContentTypes
               .Select(t => t.Alias)
               .Intersect(_requiredContentTypes);
            var requiredContentTypesExists = requiredContentTypes
               .Count() == _requiredContentTypes.Length;
            if (!requiredContentTypesExists)
            { return VersionStatus.Update; }

            var notAllRemoved = _removedDataTypes.Any(d => _existingDataTypes.FirstOrDefault(e => e.Name != null && e.Name.Equals(d)) != null);
            if (notAllRemoved)
            { return VersionStatus.Update; }

            return VersionStatus.UpToDate;
        }

        public async Task<int> GetVersionStatusCode()
        {
            var status = await GetVersionStatus();
            return (int)status;
        }

        private async Task<IDataType[]> GetAllWysiwgDataTypes()
        {
            var allDtTypes = await dataTypeService.GetAllAsync();

            var rVal = allDtTypes
                .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix))
                .ToArray();

            return rVal;
        }

        private static string GetErrorMessage(string name, bool isDataType = false)
        {
            if (isDataType)
            {
                return $"{ErrorMsgPrefix} Could not create data type {name}.";
            }
            return $"{ErrorMsgPrefix} Could not create content type {name}.";
        }

        private Guid CurrentUserKey
        {
            get
            {
                var key = httpContextAccessor.HttpContext?.User?.Identity?.GetUserKey()
                    ?? backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser?.Key;
                return key ?? Guid.Empty;
            }
        }

        private string GetElementKeyByName(string name)
        {
            return GetElementKeyGuidByName(name).ToString();
        }

        private Guid GetElementKeyGuidByName(string name)
        {
            var prefixedName = $"{Constants.Prefix}{name}";
            var type = _allContentTypes
                .FirstOrDefault(t => t.Alias.Equals(prefixedName));
            if (type == null)
            {
                throw new Exception($"{_errorMsgDataTypeNotFoundStart} {prefixedName}");
            }
            else
            {
                return type.Key;
            }
        }
        #endregion

        #region data types
        private async Task CreateOrUpdateDataTypesForBlockElements(uReferenceByIdModel parent)
        {
            foreach (var name in _requiredDataTypes)
            {
                switch (name)
                {
                    case $"{Constants.Prefix}HeadlineSizes":
                        await CreateDataTypeHeadlineSizes(name, parent);
                        break;
                    case $"{Constants.Prefix}ParagaphRTE":
                        await CreateDataTypeParagaphRTE(name, parent);
                        break;
                    case $"{Constants.Prefix}LimitedHeadline":
                        await CreateDataTypeLimitedHeadline(name, parent);
                        break;
                    case $"{Constants.Prefix}ImageAndCropPicker":
                        await CreateDataTypeImageMediaPicker(name, parent);
                        break;
                    case $"{Constants.Prefix}CustomerColors":
                        await CreateDataTypeCustomerColors(name, parent);
                        break;
                    default:
                        break;
                }
            }
            _existingDataTypes = [.. await GetAllWysiwgDataTypes()];
        }

        private async Task CreateDataTypeHeadlineSizes(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.RadioButtonList",
                EditorUiAlias = "Umb.PropertyEditorUi.RadioButtonList",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "items",
                        Value = new string[] { "h1", "h2", "h3" }
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateDataTypeParagaphRTE(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.RichText",
                EditorUiAlias = "Umb.PropertyEditorUi.Tiptap",
                Values =
                [
                    new DataTypePropertyPresentationModel {
                        Alias = "extensions",
                        Value = new List<string>() {
                            "Umb.Tiptap.RichTextEssentials",
                            "Umb.Tiptap.Link",
                            "Umb.Tiptap.Subscript",
                            "Umb.Tiptap.Superscript",
                            "Umb.Tiptap.TextAlign",
                            "Umb.Tiptap.Underline"
                        }
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxImageSize",
                        Value = 500
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "overlaySize",
                        Value = "medium"
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "toolbar",
                        Value = new List<List<List<string>>>()
                        {
                            new(){
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.SourceEditor"
                                },
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.Bold",
                                    "Umb.Tiptap.Toolbar.Italic",
                                    "Umb.Tiptap.Toolbar.Underline"
                                },
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.TextAlignLeft",
                                    "Umb.Tiptap.Toolbar.TextAlignCenter",
                                    "Umb.Tiptap.Toolbar.TextAlignRight"
                                },
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.BulletList",
                                    "Umb.Tiptap.Toolbar.OrderedList"
                                },
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.Blockquote",
                                    "Umb.Tiptap.Toolbar.HorizontalRule"
                                },
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.Link",
                                    "Umb.Tiptap.Toolbar.Unlink"
                                },
                            },
                            new(){
                                new List<string>(){
                                    "Umb.Tiptap.Toolbar.Heading2",
                                    "Umb.Tiptap.Toolbar.Heading3"
                                }
                            }

                        }
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateDataTypeLimitedHeadline(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.TextBox",
                EditorUiAlias = "Umb.PropertyEditorUi.TextBox",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "inputType",
                        Value = "text"
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxChars",
                        Value = 120
                    }
                    ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateDataTypeCustomerColors(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.ColorPicker",
                EditorUiAlias = "Umb.PropertyEditorUi.ColorPicker",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "useLabel",
                        Value = true
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "items",
                        Value = @"
[
    {""value"":""5c9aff"",""label"":""Blue""},
    {""value"":""fee648"",""label"":""Yellow""},
    {""value"":""ffffff"",""label"":""White""},
    {""value"":""fff"",""label"":""Transparent""},
    {""value"":""000"",""label"":""Black""}
]".GetJsonArrayFromString()
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateDataTypeImageMediaPicker(string name, uReferenceByIdModel parent)
        {
            IDataType? previous = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals("wysiwg65_ImageMediaPicker"));

            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Wysiwg.ImageAndCropPicker",
                EditorUiAlias = "wysiwg.PropertyEditorUi.ImageAndCropPicker",
                Values = [
                    new DataTypePropertyPresentationModel {
                            Alias = "multiple",
                            Value = false
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "filter",
                        Value = "cc07b313-0843-4aa8-bbda-871c8da728c8" //"cc07b313-0843-4aa8-bbda-871c8da728c8,c4b1efcf-a9d5-41c4-9621-e9d273b52a9c"
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "crops",
                        Value = @"
[
    {""label"":""Square"",""alias"":""1485x1485"",""width"":1485,""height"":1485},
    {""label"":""Portrait"",""alias"":""1050x1485"",""width"":1050,""height"":1485},
    {""label"":""Landscape"",""alias"":""1485x1050"",""width"":1485,""height"":1050}
]".GetJsonArrayFromString()
                    },
                    new DataTypePropertyPresentationModel {
                            Alias = "enableLocalFocalPoint",
                            Value = true
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateOrUpdateDataType(DataTypeModelBase dataTypeRequestModel, IDataType? dataType = null)
        {
            if (dataTypeRequestModel == null)
            { return; }

            var msg = GetErrorMessage(dataTypeRequestModel.Name, true);
            Attempt<IDataType, DataTypeOperationStatus> attempt;

            dataType ??= await dataTypeService.GetAsync(dataTypeRequestModel.Name);

            if (dataType == null)
            {
                var configuration = dataTypeRequestModel
                    .Values.ToDictionary(v => v.Alias, v => v.Value ?? new object())
                    ?? [];

                IDataEditor? editor = new DataEditor(dataValueEditorFactory)
                {
                    Alias = dataTypeRequestModel.EditorAlias,
                    DefaultConfiguration = configuration
                };

                dataType = new DataType(editor, jsonSerializer, _dataTypeContainer?.Id ?? -1)
                {
                    Name = dataTypeRequestModel.Name,
                    EditorUiAlias = dataTypeRequestModel.EditorUiAlias,
                    Key = Guid.NewGuid()
                };

                attempt = await dataTypeService.CreateAsync(dataType, CurrentUserKey);
                if (!attempt.Success)
                {
                    throw new Exception($"{msg} Status: {attempt.Status} Exception: {attempt.Exception?.Message}");
                }
            }
            else
            {
                var values = dataTypeRequestModel.Values
                    .ToDictionary(v => v.Alias, v => v.Value ?? new object())
                    ?? [];

                dataType.Name = dataTypeRequestModel.Name;
                dataType.Editor = new DataEditor(dataValueEditorFactory)
                {
                    Alias = dataTypeRequestModel.EditorAlias,
                    DefaultConfiguration = values
                };
                dataType.EditorUiAlias = dataTypeRequestModel.EditorUiAlias;
                dataType.ConfigurationData = values;

                attempt = await dataTypeService.UpdateAsync(dataType, CurrentUserKey);
            }

            _existingDataTypes = await GetAllWysiwgDataTypes();
        }

        private async Task<EntityContainer?> GetDataTypeContainer()
        {
            return (await dataTypeContainerService
                .GetAllAsync())
                .FirstOrDefault(c => c.Name != null && c.Name.InvariantEquals(_dtContainerName));
        }

        private async Task<EntityContainer?> CreateDataTypeContainer()
        {
            EntityContainer? container = await GetDataTypeContainer();
            if (container == null)
            {
                var newGuid = Guid.NewGuid();
                var attempt = await dataTypeContainerService.CreateAsync(newGuid, _dtContainerName, null, CurrentUserKey);
                if (attempt.Success)
                {
                    container = attempt.Result;
                }
            }

            if (container == null)
            {
                throw new Exception($"{ErrorMsgPrefix} Could not create data type container: {_dtContainerName}");
            }

            return container;
        }

        private async Task RemoveDataTypes()
        {
            foreach (var name in _removedDataTypes)
            {
                IDataType? previous = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(name));
                if (previous != null)
                {
                    var attempt = await dataTypeService.DeleteAsync(previous.Key, CurrentUserKey);
                    if (!attempt.Success)
                    {
                        logger.LogWarning($"Data type {name} could not be deleted");
                    }
                }
            }
        }

        #endregion

        #region Block Grid Data Type
        private async Task CreateDataTypeBlockGrid(uReferenceByIdModel parent)
        {
            UpdateContentTypes();

            _existingDataTypes = [.. await dataTypeService.GetAllAsync()];
            var current = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(_requiredBlockGridName));
            if (current == null)
            {
                var blockGroupKey = Guid.NewGuid();
                var rowSettingsKey = GetElementKeyByName("rowSettings");
                var paragraphKey = GetElementKeyByName("paragraph");
                var paragraphSettingsKey = GetElementKeyByName("paragraphSettings");
                var imageAndCropPickerKey = GetElementKeyByName("croppedPicture");
                var headlineKey = GetElementKeyByName("headline");
                var headlineSettingsKey = GetElementKeyByName("headlineSettings");
                var layoutKeys = new string[] { "layout1", "layout2", "layout3", "layout4" }
                    .Select(l => GetElementKeyByName(l))
                    .ToArray();
                var blocksValueJson = @$"
                [
                    {{
                        ""contentElementTypeKey"":""{headlineKey}"",
                        ""allowAtRoot"": false,
                        ""allowInAreas"": true,
                        ""settingsElementTypeKey"":""{headlineSettingsKey}""
                    }},
                    {{
                        ""contentElementTypeKey"":""{paragraphKey}"",
                        ""allowAtRoot"":false,
                        ""allowInAreas"":true,
                        ""settingsElementTypeKey"":""{paragraphSettingsKey}""
                    }},
                    {{
                        ""contentElementTypeKey"":""{imageAndCropPickerKey}"",
                        ""allowAtRoot"":false,
                        ""allowInAreas"":true
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[0]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{blockGroupKey}"",
                        ""settingsElementTypeKey"":""{rowSettingsKey}"",
                        ""areas"":
                        [
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""Full Row"",
                                ""columnSpan"":12,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":[]
                            }}
                        ]
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[1]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{blockGroupKey}"",
                        ""settingsElementTypeKey"":""{rowSettingsKey}"",
                        ""areas"":
                        [
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":
                                ""left"",
                                ""columnSpan"":6,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }},
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""right"",
                                ""columnSpan"":6,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }}
                        ]
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[2]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{blockGroupKey}"",
                        ""settingsElementTypeKey"":""{rowSettingsKey}"",
                        ""areas"":
                        [
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""left"",
                                ""columnSpan"":4,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }},
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""right"",
                                ""columnSpan"":8,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }}
                        ]
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[3]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{blockGroupKey}"",
                        ""settingsElementTypeKey"":""{rowSettingsKey}"",
                        ""areas"":
                        [
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""left"",
                                ""columnSpan"":8,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }},
                            {{
                                ""key"":""{Guid.NewGuid()}"",
                                ""alias"":""right"",
                                ""columnSpan"":4,
                                ""rowSpan"":1,
                                ""minAllowed"":0,
                                ""specifiedAllowance"":
                                [
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{paragraphKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{imageAndCropPickerKey}""
                                    }}
                                ]
                            }}
                        ]
                    }}
                ]";
                var blocksValue = blocksValueJson.GetJsonArrayFromString();

                var blockGroupsValue = @$"
                [
                    {{
                        ""name"":""Layouts"",
                        ""key"":""{Guid.NewGuid()}""
                    }}
                ]".GetJsonArrayFromString();

                var createDataTypeRequestModel = new CreateDataTypeRequestModel
                {
                    Parent = parent,
                    Name = _requiredBlockGridName,
                    EditorAlias = "Umbraco.BlockGrid",
                    EditorUiAlias = "Umb.PropertyEditorUi.BlockGrid",
                    Values =
                    [
                        new DataTypePropertyPresentationModel {
                        Alias = "gridColumns",
                        Value = 12
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "blocks",
                        Value = blocksValue
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "blockGroups",
                        Value = blockGroupsValue
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxPropertyWidth",
                        Value = "1204px"
                    }
                    ]
                };
                await CreateOrUpdateDataType(createDataTypeRequestModel);
            }
            else
            {
                var config = current.ConfigurationData;
                var layoutStylesheet = config.FirstOrDefault(v => v.Key == "layoutStylesheet").Value;
                var blockGroupsJson = config.FirstOrDefault(v => v.Key == "blockGroups")
                    .Value.ToJson();
                var blockGroups = JsonSerializer.Deserialize<IEnumerable<BGBlockGroupModel>>(blockGroupsJson);

                var currentblockLayoutGroupKey = blockGroups?.FirstOrDefault(g => g.Name.Equals("Layouts"))?.Key.ToString();
                if (string.IsNullOrEmpty(currentblockLayoutGroupKey))
                {
                    throw new Exception($"{_errorMsgUpdateContentTypeStart} CreateDataTypeBlockGrid: no layout group found!");
                }
                var newDepricatedGroupKey = Guid.NewGuid();
                var blockGroupsValue = @$"
                [
                    {{
                        ""name"":""Layouts"",
                        ""key"":""{currentblockLayoutGroupKey}""
                    }},
                    {{
                        ""name"":""Deprecated"",
                        ""key"":""{newDepricatedGroupKey}""
                    }}
                ]".GetJsonArrayFromString();

                var blocksJson = config.FirstOrDefault(v => v.Key == "blocks")
                    .Value.ToJson();

                var blockModels = new List<BGBlockModel>
                {
                    new()
                    {
                        ContentElementTypeKey = GetElementKeyGuidByName("croppedPicture"),
                        AllowAtRoot = false,
                        AllowInAreas = true,
                        SettingsElementTypeKey = null
                    }
                };
                blockModels.AddRange(JsonSerializer.Deserialize<IEnumerable<BGBlockModel>>(blocksJson) ?? []);

                foreach (var block in blockModels)
                {
                    if (block.Areas.Count() > 0)
                    {
                        foreach (var area in block.Areas)
                        {
                            if (area.SpecifiedAllowance != null && area.SpecifiedAllowance.Any())
                            {
                                var specifiedAllowance = new List<BGSpecfiedAllowanceModel>{
                                    new()
                                    {
                                        ElementTypeKey = GetElementKeyGuidByName("croppedPicture"),
                                        MinAllowed = 0
                                    }
                                };
                                specifiedAllowance.AddRange(area.SpecifiedAllowance);
                                area.SpecifiedAllowance = specifiedAllowance;
                            }
                        }
                    }
                }

                var pictureWithCropBlock = blockModels
                        .FirstOrDefault(b => b.ContentElementTypeKey != null
                            && b.ContentElementTypeKey.Equals(GetElementKeyGuidByName("pictureWithCrop")));
                if (pictureWithCropBlock != null)
                {
                    pictureWithCropBlock.GroupKey = newDepricatedGroupKey;
                }

                var blocksValue = JsonSerializer.Serialize(blockModels).GetJsonArrayFromString();

                var updateDataTypeRequestModel = new UpdateDataTypeRequestModel
                {
                    Name = _requiredBlockGridName,
                    EditorAlias = "Umbraco.BlockGrid",
                    EditorUiAlias = "Umb.PropertyEditorUi.BlockGrid",
                    Values =
                    [
                        new DataTypePropertyPresentationModel {
                            Alias = "gridColumns",
                            Value = 12
                        },
                        new DataTypePropertyPresentationModel {
                            Alias = "blocks",
                            Value = blocksValue
                        },
                        new DataTypePropertyPresentationModel {
                            Alias = "blockGroups",
                            Value = blockGroupsValue
                        },
                        new DataTypePropertyPresentationModel {
                            Alias = "maxPropertyWidth",
                            Value = "1204px"
                        },
                        new DataTypePropertyPresentationModel {
                            Alias = "layoutStylesheet",
                            Value = layoutStylesheet
                        }
                    ]
                };
                await CreateOrUpdateDataType(updateDataTypeRequestModel, current);

                _existingDataTypes = [.. await dataTypeService.GetAllAsync()];
                var updated = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(_requiredBlockGridName));
            }
        }

        #endregion

        #region block elements
        private void UpdateContentTypes()
        {
            _allContentTypes = [.. contentTypeService.GetAll().Where(t => t.Alias.StartsWith(Constants.Prefix))];
        }

        private async Task CreateBlockElements()
        {
            CreateOrUpdateContentElementContainers();

            UpdateContentTypes();

            var requiredExists = _allContentTypes
                .Select(t => t.Alias)
                .Intersect(_requiredContentTypes)
                .Count() == _requiredContentTypes.Length + _needUpdateContentTypes.Length;
            var missingRequired = _requiredContentTypes
                .Except(_allContentTypes.Select(t => t.Alias))
                .Concat(_needUpdateContentTypes);
            if (_allContentTypes.Length == 0 || !requiredExists)
            {
                foreach (var elementTypeAlias in missingRequired)
                {
                    #region create new
                    #region Block Elements
                    //EntityContainer elementContainer = await CreateOrUpdateBContentElements(elementTypeAlias);
                    await CreateOrUpdateContentElements(elementTypeAlias);
                    #endregion

                    #region Block Layouts
                    var elementContainer = _blockContainers[BlockLayoutsName];
                    for (var index = 1; index <= 4; index++)
                    {
                        await CreateOrUpdateLayoutElementType(elementTypeAlias, $"{Constants.Prefix}layout{index}", elementContainer, index);
                    }
                    #endregion

                    #region Block Settings
                    elementContainer = _blockContainers[BlockSettingsName];
                    await CreateOrUpdateHeadlineSettingsElementType(elementTypeAlias, $"{Constants.Prefix}headlineSettings", elementContainer);
                    await CreateOrUpdateParagraphSettingsElementType(elementTypeAlias, $"{Constants.Prefix}paragraphSettings", elementContainer);
                    await CreateOrUpdateRowSettingsElementType(elementTypeAlias, $"{Constants.Prefix}rowSettings", elementContainer);

                    #endregion

                    #endregion
                }
            }
            else if (_resetExisting)
            {
                //TODO: complete implementation
                #region reset existing
                #region Block Elements
                var elementContainer = _blockContainers[BlockElementsName];

                foreach (var type in _allContentTypes)
                {
                    switch (type.Alias.Replace(Constants.Prefix, string.Empty))
                    {
                        case "headline":
                            //properties: text
                            break;
                        case "paragraph":
                            //properties: text
                            break;
                        //case "pictureWithCrop":
                        //    //properties: mediaItem
                        //    break;
                        case "croppedPicture":
                            //properties: mediaItem
                            break;
                        default:
                            break;
                    }
                }
                #endregion

                #region Block Layouts
                elementContainer = _blockContainers[BlockLayoutsName];
                foreach (var type in _allContentTypes)
                {
                    switch (type.Alias.Replace(Constants.Prefix, string.Empty))
                    {
                        case "layout1":
                            break;
                        case "layout2":
                            break;
                        case "layout3":
                            break;
                        case "layout4":
                            break;
                        default:
                            break;
                    }
                }
                #endregion

                #region Block Settings
                elementContainer = _blockContainers[BlockSettingsName];
                foreach (var type in _allContentTypes)
                {
                    switch (type.Alias.Replace(Constants.Prefix, string.Empty))
                    {
                        case "HeadlineSettings":
                            //properties: color, size, margin
                            break;
                        case "ParagraphSettings":
                            //properties: color
                            break;
                        case "RowSettings":
                            //properties: backgroundImage, backgroundColor
                            break;
                        default:
                            break;
                    }
                }
                #endregion
                #endregion
            }

            #region Depricated
            if (_depricatedContentTypes.Length > 0)
            {
                foreach (var elementTypeAlias in _depricatedContentTypes)
                {
                    var current = contentTypeService.Get(elementTypeAlias);
                    if (current != null)
                    {
                        var elementContainer = _blockContainers[DepricatedElementsName];
                        await CreateOrUpdatePictureWithCropElementType(elementTypeAlias, elementTypeAlias, elementContainer, current);
                    }
                }
            }
            #endregion
        }

        private async Task CreateOrUpdateContentElements(string elementTypeAlias, bool? culture = null, bool? segment = null)
        {
            var elementContainer = _blockContainers[BlockElementsName];

            var alias = $"{Constants.Prefix}headline";
            var compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateHeadlineElementType(compareAlias, alias, elementContainer, culture, segment);

            alias = $"{Constants.Prefix}paragraph";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateParagraphElementType(compareAlias, alias, elementContainer, culture, segment);

            alias = $"{Constants.Prefix}croppedPicture";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateCroppedPictureElementType(compareAlias, alias, elementContainer, culture, segment);
        }

        private void CreateOrUpdateContentElementContainers()
        {
            Attempt<OperationResult<OperationResultType, EntityContainer>?> containerAttempt;
            var containerName = _contentElementsRootContainer;
            EntityContainer? rootContainer = contentTypeService.GetContainers(containerName, 1).FirstOrDefault();
            if (rootContainer == null)
            {
                containerAttempt = contentTypeService.CreateContainer(-1, Guid.NewGuid(), containerName);
                if (containerAttempt.Success)
                {
                    rootContainer = containerAttempt.Result?.Entity;
                }
            }
            if (rootContainer == null)
            {
                throw new Exception($"{ErrorMsgPrefix} Could not create root content type folder.");
            }


            var _containerNames = new List<string>(_level2ContainerNames);
            if (_depricatedContentTypes.Length > 0)
            {
                _containerNames.Add(DepricatedElementsName);
            }

            foreach (var name in _containerNames)
            {
                var container = contentTypeService.GetContainers(name, 2).FirstOrDefault();
                if (container != null)
                {
                    _ = _blockContainers.TryAdd(name, container);
                    continue;
                }

                containerAttempt = contentTypeService.CreateContainer(rootContainer.Id, Guid.NewGuid(), name);
                if (containerAttempt.Success)
                {
                    container = containerAttempt.Result?.Entity;
                }

                if (container == null)
                {
                    throw new Exception($"{ErrorMsgPrefix} Could not create {name} folder.");
                }
                else
                { _ = _blockContainers.TryAdd(name, container); }
            }
        }

        private async Task CreateOrUpdateRowSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type != null)
            {

            }
            else
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Row Settings",
                    Icon = "icon-settings color-red",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Nothing,
                };

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (ctAttempt.Success)
                {
                    var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Background Color", $"{Constants.Prefix}CustomerColors", 1),
                    new ("Background Image", "Media Picker", 2),
                    new ("Padding", "Textstring", 3)
                };
                    await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
                }
            }
        }

        private async Task CreateOrUpdateParagraphSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type != null)
            {

            }
            else
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Paragraph Settings",
                    Icon = "icon-settings color-red",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Nothing,
                };

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (ctAttempt.Success)
                {
                    var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Color", $"{Constants.Prefix}CustomerColors", 1)
                };
                    await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
                }
            }
        }

        private async Task CreateOrUpdateHeadlineSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type != null)
            {

            }
            else
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Headline Settings",
                    Icon = "icon-heading-1 color-red",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Nothing,
                };

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (ctAttempt.Success)
                {
                    var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Color", $"{Constants.Prefix}CustomerColors", 1),
                    new ("Margin", "Textstring", 2),
                    new ("Size", $"{Constants.Prefix}HeadlineSizes", 3)
                };
                    await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
                }
            }
        }

        private async Task CreateOrUpdateLayoutElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, int index)
        {
            if (elementTypeAlias != alias)
            { return; }

            var iconColor = "color-light-blue";
            var type = contentTypeService.Get(alias);
            if (type != null)
            {

            }
            else
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "?",
                    Icon = $"icon-layout {iconColor}",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Nothing,
                };
                switch (index)
                {
                    case 1:
                        type.Name = "Full Row";
                        type.Icon = $"icon-fullscreen {iconColor}";
                        break;
                    case 2:
                        type.Name = "Two Column Row";
                        type.Icon = $"icon-table {iconColor}";
                        break;
                    case 3:
                        type.Name = "Article";
                        type.Icon = $"icon-article {iconColor}";
                        break;
                    default:
                        var layoutIndex = alias.Replace($"{Constants.Prefix}layout", string.Empty);
                        type.Name = $"Layout {layoutIndex}";
                        type.Icon = $"icon-layout {iconColor}";
                        break;
                }

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (!ctAttempt.Success)
                {
                    throw new Exception($"{ErrorMsgPrefix} Could not create content type {type.Name} [{alias}].");
                }
            }
        }

        private async Task CreateOrUpdateParagraphElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type == null)
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Paragraph",
                    Icon = "icon-document-html",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Culture,
                };

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (!ctAttempt.Success)
                {
                    throw new Exception($"{type.Name} [{alias}] creation failed.");
                }
            }
            else
            {
                UpdateCultureAndSegment(culture, segment, type);
            }
            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Text", $"{Constants.Prefix}ParagaphRTE",1, variations: ContentVariation.Culture)
            };
            await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
        }

        private async Task CreateOrUpdateCroppedPictureElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type == null)
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Cropped Picture",
                    Icon = "icon-document-image",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Culture,
                };
                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (!ctAttempt.Success)
                {
                    throw new Exception($"{type.Name} [{alias}] creation failed.");
                }
            }
            else
            {
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Media Item", $"{Constants.Prefix}ImageAndCropPicker", 1),
                new ("Alternative Text", "Textstring", 2, variations : ContentVariation.Culture),
                new ("Fig Caption", "Textstring", 3, variations : ContentVariation.Culture),
                new ("Caption Color", $"{Constants.Prefix}CustomerColors", 5)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions);

        }

        private async Task CreateOrUpdatePictureWithCropElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, IContentType? current)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Picture with Crop",
                Icon = "icon-document-image",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Culture,
            };
            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Media Item", $"{Constants.Prefix}ImageMediaPicker", 1),
                new ("Alternative Text", "Textstring", 2, variations: ContentVariation.Culture),
                new ("Fig Caption", "Textstring", 3, variations: ContentVariation.Culture),
                new ("Crop Alias", $"{Constants.Prefix}CropNames", 4),
                new ("Caption Color", $"{Constants.Prefix}CustomerColors", 5)
            };

            Attempt<ContentTypeOperationStatus> ctAttempt;
            if (current == null)
            {
                ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (ctAttempt.Success)
                {
                    await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
                }
            }
            else
            {
                current.SetParent(elementContainer);
                ctAttempt = await contentTypeService.UpdateAsync(current, CurrentUserKey);
                if (!ctAttempt.Success)
                {
                    logger.LogWarning("Content type {alias} could not be updated", alias);
                }
            }
        }

        private async Task CreateOrUpdateHeadlineElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            if (type == null)
            {
                type = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = alias,
                    Name = "Headline",
                    Icon = "icon-heading-1",
                    IsElement = true,
                    AllowedAsRoot = false,
                    Variations = ContentVariation.Culture,
                };

                var ctAttempt = await contentTypeService.CreateAsync(type, CurrentUserKey);
                if (!ctAttempt.Success)
                {
                    throw new Exception($"{type.Name} [{alias}] creation failed.");
                }
            }
            else
            {
                UpdateCultureAndSegment(culture, segment, type);
            }
            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Text", $"{Constants.Prefix}LimitedHeadline", 1, "The text of the headline", ContentVariation.Culture)
            };
            await CreateOrUpdateContentElementProperties(type, propertyDefinitions);
        }

        private static void UpdateCultureAndSegment(bool? culture, bool? segment, IContentType type)
        {
            type.Variations = ContentVariation.Nothing;
            var enableVaryByCulture = culture ?? true;
            var enableVaryBySegment = segment ?? false;//default = false, because from v15.4.0 Umbraco does not support segment variation on element types
            if (enableVaryByCulture && enableVaryBySegment)
            {
                type.Variations = ContentVariation.CultureAndSegment;
            }
            else if (enableVaryByCulture)
            {
                type.Variations = ContentVariation.Culture;
            }
            else if (enableVaryBySegment)
            {
                type.Variations = ContentVariation.Segment;
            }
        }

        private async Task CreateOrUpdateContentElementProperties(IContentType type, IEnumerable<PropertyDefinition> propertyDefinitions)
        {
            if (type == null)
            { return; }

            var propItems = new List<PropertyType>();
            IDataType dt;
            foreach (var definition in propertyDefinitions)
            {
                dt = await dataTypeService.GetAsync(definition.DataTypeName)
                    ?? throw new Exception($"{_errorMsgDataTypeNotFoundStart} {definition.DataTypeName}");
                propItems.Add(
                    new(shortStringHelper, dt)
                    {
                        Alias = definition.Name.ToFirstLower().Replace(" ", string.Empty),
                        Name = definition.Name,
                        Description = definition.Description,
                        Mandatory = false,
                        SortOrder = definition.SortOrder,
                        DataTypeId = dt.Id,
                        Variations = definition.Variations
                    });
            }

            await AddOrUpdateProperties(type, propItems, "Content");
        }

        private async Task UpdateContentElementProperties(IContentType type, IEnumerable<PropertyDefinition> propertyUpdateDefinitions)
        {
            if (type == null)
            { return; }

            var typeProperties = type.PropertyTypes;
            var removedPropertyAlias = typeProperties
                .Where(p => !propertyUpdateDefinitions.Any(d => d.Name.InvariantEquals(p.Name)))
                .Select(p => p.Alias);
            var addedProperties = propertyUpdateDefinitions
                .Where(d => !typeProperties.Any(p => d.Name.InvariantEquals(p.Name)));
            var updateProperties = propertyUpdateDefinitions
                .Where(d => typeProperties.Any(p => d.Name.InvariantEquals(p.Name)));

            #region add
            if (addedProperties.Any())
            {
                var propItems = new List<PropertyType>();
                IDataType dt;
                foreach (var definition in addedProperties)
                {
                    dt = await dataTypeService.GetAsync(definition.DataTypeName)
                        ?? throw new Exception($"{_errorMsgDataTypeNotFoundStart} {definition.DataTypeName}");
                    propItems.Add(
                        new(shortStringHelper, dt)
                        {
                            Alias = definition.Name.ToFirstLower().Replace(" ", string.Empty),
                            Name = definition.Name,
                            Description = definition.Description,
                            Mandatory = false,
                            SortOrder = definition.SortOrder,
                            DataTypeId = dt.Id,
                            Variations = definition.Variations
                        });
                }
                if (propItems.Count != 0)
                { await AddOrUpdateProperties(type, propItems, "Content", updateType: false); }
            }
            #endregion

            #region remove
            foreach (var alias in removedPropertyAlias)
            {
                type.RemovePropertyType(alias);
            }
            #endregion

            #region update
            foreach (var definition in updateProperties)
            {
                var prop = typeProperties.FirstOrDefault(p => p.Name.InvariantEquals(definition.Name));
                if (prop != null)
                {
                    prop.Name = definition.Name;
                    prop.Description = definition.Description;
                    prop.SortOrder = definition.SortOrder;
                }
            }
            #endregion

            var attempt = await contentTypeService.UpdateAsync(type, CurrentUserKey);
            if (!attempt.Success)
            {
                throw new Exception($"{_errorMsgUpdateContentTypeStart} {type.Name}.");
            }
        }

        private async Task AddOrUpdateProperties(IContentType type, IEnumerable<PropertyType> propItems, string groupName, int groupSortOrder = 1, bool updateType = true)
        {
            var propertyCollection = new PropertyTypeCollection(true, propItems);
            var group = new PropertyGroup(isPublishing: true)
            {
                Alias = groupName.ToLower(),
                Name = groupName,
                SortOrder = groupSortOrder,
                PropertyTypes = propertyCollection
            };
            if (!type.PropertyGroups.Contains(group))
            {
                type.PropertyGroups.Add(group);
            }

            if (updateType)
            {
                var attempt = await contentTypeService.UpdateAsync(type, CurrentUserKey);
                if (!attempt.Success)
                {
                    throw new Exception($"{_errorMsgUpdateContentTypeStart} {type.Name}.");
                }
            }
        }

        #region obsolete
        //private async Task LegacySwitchPartialViews(bool restoreOriginal = false)
        //{
        //    var allPartialViews = await partialViewService.GetAllAsync();
        //    if (allPartialViews == null)
        //    { return; }

        //    var prefix = "backup-";
        //    var itemsPartial = $"blockgrid\\{(restoreOriginal ? prefix : "")}items.";
        //    var itemsPartialViews = allPartialViews
        //        .FirstOrDefault(v => v.Path.InvariantContains(itemsPartial));
        //    if (itemsPartialViews == null)
        //    { return; }

        //    var updateModel = new PartialViewRenameModel
        //    {
        //        Name = $"{(restoreOriginal ? "" : prefix)}items.cshtml"
        //    };
        //    var attempt = await partialViewService.RenameAsync(itemsPartialViews.Path, updateModel, CurrentUserKey);
        //    if (!attempt.Success)
        //    {
        //        throw new Exception($"{ErrorMsgPrefix} {attempt.Status}");
        //    }
        //}
        #endregion

        private async Task SwitchPartialViews(bool restoreOriginal = false)
        {
            var folderName = "blockgrid";
            var allPartialViews = (await partialViewService.GetAllAsync())
                ?.Where(v => v.Path.InvariantContains(folderName));
            if (allPartialViews == null)
            { return; }

            var originalPartialName = "items.cshtml";
            var backupPartialName = "backup-items.cshtml";

            var original = allPartialViews
                .FirstOrDefault(v => v.Path.InvariantEndsWith($"{folderName}\\{originalPartialName}"));

            var backup = allPartialViews
                .FirstOrDefault(v => v.Path.InvariantEndsWith(backupPartialName));

            if (restoreOriginal)
            {
                await RestoreItemsPartial(backup, original, originalPartialName);
            }
            else
            {
                await BackupItemsPartial(backup, original, backupPartialName);
            }
        }
        private async Task BackupItemsPartial(IPartialView? backup, IPartialView? original, string backupPartialName)
        {
            if (backup != null)
            {
                logger.LogWarning("Backup partial view {alias} already exists.", backup.Path);
                return;
            }
            if (original == null)
            {
                logger.LogWarning("Original partial view to backup does not exist.");
                return;
            }

            await RenamePartialView(original.Path, backupPartialName);
        }
        private async Task RestoreItemsPartial(IPartialView? backup, IPartialView? original, string originalPartialName)
        {
            if (backup == null)
            {
                logger.LogWarning("Backup partial view for {name} does not exist.", originalPartialName);
                return;
            }
            if (original != null)
            {
                logger.LogWarning("Original partial view {alias} already exists.", original.Path);
                return;
            }

            await RenamePartialView(backup.Path, originalPartialName);
        }
        private async Task RenamePartialView(string path, string newName)
        {
            var updateModel = new PartialViewRenameModel
            { Name = newName };
            var attempt = await partialViewService.RenameAsync(path, updateModel, CurrentUserKey);
            if (!attempt.Success)
            {
                logger.LogWarning("Partial view {alias} could not be renamed: {error}", path, attempt.Status);
                throw new Exception($"{ErrorMsgPrefix} {attempt.Status}");
            }
        }
        #endregion

        #endregion

        #region uninstall
        public async Task Uninstall()
        {
            if (_isInstalling || _isUninstalling)
            { return; }

            _isUninstalling = true;

            try
            {
                var errorStart = "Error during uninstallation of WYSIWG Umbraco Community Extensions:";

                await DeleteContentElementTypes(errorStart);

                DeleteContentTypeContainers(errorStart);

                await DeleteDataTypes(errorStart);

                await DeleteDataTypeContainer(errorStart);

                await RecoverPartialViews();
            }
            catch
            {
                throw;
            }
            finally
            {
                _dataTypeContainer = null;
                _isUninstalling = false;
            }
        }

        private async Task DeleteContentElementTypes(string errorStart)
        {
            var allContentTypes = contentTypeService.GetAll()
                .Where(t => t.Alias.StartsWith(Constants.Prefix));

            foreach (var type in allContentTypes ?? [])
            {
                if (type == null)
                { continue; }

                var result = await contentTypeService.DeleteAsync(type.Key, CurrentUserKey);
                if (result != ContentTypeOperationStatus.Success)
                {
                    throw new Exception($"{errorStart} Could not delete content type:  {type.Name}");
                }
            }
        }

        private void DeleteContentTypeContainers(string errorStart)
        {
            Attempt<OperationResult?> attempt;
            EntityContainer? container;

            var _containerNames = new List<string>(_level2ContainerNames)
            {
                DepricatedElementsName
            };

            foreach (var name in _containerNames)
            {
                container = contentTypeService.GetContainers(name, 2).FirstOrDefault();
                if (container != null)
                {
                    attempt = contentTypeService.DeleteContainer(container.Id);
                    if (!attempt.Success)
                    {
                        throw new Exception($"{errorStart} Could not delete {container.Name} folder.");
                    }
                    else
                    {
                        _ = _blockContainers.TryRemove(name, out EntityContainer? removedContainer);
                    }
                }
            }

            container = contentTypeService.GetContainers(_contentElementsRootContainer, 1).FirstOrDefault();
            if (container != null)
            {
                attempt = contentTypeService.DeleteContainer(container.Id);
                if (!attempt.Success)
                {
                    throw new Exception($"{errorStart} Could not delete {container.Name} folder.");
                }
            }
        }

        private async Task DeleteDataTypes(string errorStart)
        {
            var existingDataTypes = (await GetAllWysiwgDataTypes())?
                            .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix));
            foreach (var dt in existingDataTypes ?? [])
            {
                var result = await dataTypeService.DeleteAsync(dt.Key, CurrentUserKey);
                if (!result.Success)
                {
                    throw new Exception($"{errorStart} Could not delete data type: {dt.Name}");
                }
            }
        }

        private async Task DeleteDataTypeContainer(string errorStart)
        {
            EntityContainer? container = dataTypeContainerService
                .GetAllAsync()
                .Result
                .FirstOrDefault(c => c.Name != null && c.Name.InvariantEquals(_dtContainerName));
            if (container != null)
            {
                var dtcAttempt = await dataTypeContainerService.DeleteAsync(container.Key, CurrentUserKey);
                if (!dtcAttempt.Success)
                {
                    throw new Exception($"{errorStart} Could not delete data type container.");
                }
            }
        }

        private async Task RecoverPartialViews()
        {
            await SwitchPartialViews(true);
        }

        #endregion

        #region fix after Umbraco upgrade
        public async Task FixUpgrade(bool? culture, bool? segment)
        {
            if (_isInstalling || _isUninstalling)
            { return; }
            _isInstalling = true;
            try
            {
                CreateOrUpdateContentElementContainers();

                UpdateContentTypes();

                await CreateOrUpdateContentElements(string.Empty, culture, segment);
            }
            catch
            {
                throw;
            }
            finally
            {
                _blockContainers.Clear();
                _allContentTypes = [];
                _isInstalling = false;
            }
        }
        public string GetVariations()
        {
            var variations = string.Empty;

            UpdateContentTypes();

            var headlineType = _allContentTypes
                .FirstOrDefault(t => t.Alias == $"{Constants.Prefix}headline");
            if (headlineType != null)
            {
                if (headlineType.VariesByCultureAndSegment())
                {
                    variations = "culture segment";
                }
                else if(headlineType.VariesByCulture())
                {
                    variations = "culture";
                }
                else if (headlineType.VariesBySegment())
                {
                    variations = "segment";
                }
            }

            return variations;
        }
        #endregion
    }
}
