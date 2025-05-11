using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using StackExchange.Profiling.Internal;
using Umbraco.Cms.Api.Management.ViewModels.DataType;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;
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
        private readonly string[] _layoutKeyCollection = ["layout1", "layout2", "layout3", "layout4"];
        private readonly string[] _needUpdateContentTypes = [
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}croppedPicture",
            $"{Constants.Prefix}paragraphSettings",
            $"{Constants.Prefix}rowSettings"
        ];
        private string[] _deprecatedContentTypes = [$"{Constants.Prefix}pictureWithCrop"];
        private readonly string _dtContainerName = $"{Constants.Prefix.ToFirstUpper()}DataTypes";
        private readonly string[] _requiredDataTypes = [
            $"{Constants.Prefix}HeadlineSizes",
            $"{Constants.Prefix}LimitedHeadline",
            $"{Constants.Prefix}ParagaphRTE",
            $"{Constants.Prefix}CustomerColors",
            $"{Constants.Prefix}ImageAndCropPicker",
            $"{Constants.Prefix}Rotation"
        ];
        // Do not remove previus data types without deprecation phase and documentation
        private readonly string[] _removedDataTypes = [
            //$"{Constants.Prefix}ImageMediaPicker",
            //$"{Constants.Prefix}CropNames"
        ];

        private readonly string _requiredBlockGridName = $"{Constants.Prefix}BlockGrid";
        private const string BlockElementsName = "Block Elements";
        private const string BlockLayoutsName = "Block Layouts";
        private const string BlockSettingsName = "Block Settings";
        private const string DeprecatedElementsName = "Deprecated Elements";
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
        public async Task Install()
        {
            try
            {
                var versionStatus = await GetVersionStatus();
                if (_isInstalling || _isUninstalling || versionStatus == VersionStatus.UpToDate)
                { return; }

                _isInstalling = true;

                _dataTypeContainer ??= (await CreateDataTypeContainer())
                    ?? throw new Exception($"{ErrorMsgPrefix} Could not find data type container.");

                var parent = uReferenceByIdModel.ReferenceOrNull(_dataTypeContainer?.Key)
                    ?? throw new Exception($"{ErrorMsgPrefix} could not get ReferenceByIdModel for {_dataTypeContainer?.Name}!");


                var pictureWithCropElement = contentTypeService.Get($"{Constants.Prefix}pictureWithCrop");
                if (!string.IsNullOrEmpty(pictureWithCropElement?.Alias))
                {
                    _deprecatedContentTypes = [pictureWithCropElement.Alias];
                }

                await CreateOrUpdateDataTypesForBlockElements(parent);

                await CreateBlockElements();

                await CreateOrUpdateDataTypeBlockGrid(parent);

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
            _dataTypeContainer ??= await GetDataTypeContainer();
            var install = _dataTypeContainer == null;
            if (install)
            { return VersionStatus.Install; }

            var allRequiredDataTypes = new List<string>(_requiredDataTypes) { _requiredBlockGridName };
            _existingDataTypes = await GetAllWysiwgDataTypes();
            var notAllRequiredInstalled = allRequiredDataTypes.Any(d => _existingDataTypes.FirstOrDefault(e => e.Name != null && e.Name.Equals(d)) == null);
            if (notAllRequiredInstalled)
            { return VersionStatus.Update; }

            if (!DataTypeExists("Rotation"))
            { return VersionStatus.Update; }

            UpdateContentTypes();

            if (!MinHeightPropertyExists("rowSettings", "minHeight"))
            { return VersionStatus.Update; }

            if (!MinHeightPropertyExists("paragraphSettings", "minHeight"))
            { return VersionStatus.Update; }

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
        private bool DataTypeExists(string name)
        {
            var rotationDataType = _existingDataTypes.FirstOrDefault(d => d.Name != null && d.Name.Equals($"{Constants.Prefix}{name}"));
            return rotationDataType != null;
        }

        private bool MinHeightPropertyExists(string elementName,string propertyName)
        {
            var rVal = false;
            var rowSettings = GetElementByName(elementName, false);
            if (rowSettings != null)
            {
                rVal = rowSettings.PropertyTypes
                    .Any(p => p.Alias != null && p.Alias.Equals(propertyName));
            }
            return rVal;
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

        private IContentType? GetElementByName(string name, bool throwIfNotExist = true)
        {
            var prefixedName = $"{Constants.Prefix}{name}";
            var type = _allContentTypes
                .FirstOrDefault(t => t.Alias.Equals(prefixedName));
            if (type == null)
            {
                if (throwIfNotExist)
                {
                    throw new Exception($"{_errorMsgDataTypeNotFoundStart} {prefixedName}");
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return type;
            }
        }

        private string GetElementKeyByName(string name)
        {
            return GetElementKeyGuidByName(name)?.ToString() ?? string.Empty;
        }

        private Guid? GetElementKeyGuidByName(string name, bool throwIfNotExist = true)
        {
            return GetElementByName(name, throwIfNotExist)?.Key;
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
                    case $"{Constants.Prefix}Rotation":
                        await CreateDataTypeRotation(name, parent);
                        break;
                    default:
                        break;
                }
            }
            _existingDataTypes = [.. await GetAllWysiwgDataTypes()];
        }

        private async Task CreateDataTypeRotation(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.Slider",
                EditorUiAlias = "Umb.PropertyEditorUi.Slider",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "minVal",
                        Value = -90
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxVal",
                        Value = 90
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "initVal1",
                        Value = 0
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "initVal2",
                        Value = 0
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "step",
                        Value = 5
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "enableRange",
                        Value = false
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
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
                        logger.LogWarning("Data type {name} could not be deleted", name);
                    }
                }
            }
        }

        #endregion

        #region Block Grid Data Type
        private async Task CreateOrUpdateDataTypeBlockGrid(uReferenceByIdModel parent)
        {
            UpdateContentTypes();

            _existingDataTypes = [.. await dataTypeService.GetAllAsync()];
            var current = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(_requiredBlockGridName));
            var layoutGroupName = "Layouts";
            if (current == null)
            {
                var blockGroupKey = Guid.NewGuid();
                var rowSettingsKey = GetElementKeyByName("rowSettings");
                var paragraphKey = GetElementKeyByName("paragraph");
                var paragraphSettingsKey = GetElementKeyByName("paragraphSettings");
                var imageAndCropPickerKey = GetElementKeyByName("croppedPicture");
                var headlineKey = GetElementKeyByName("headline");
                var headlineSettingsKey = GetElementKeyByName("headlineSettings");

                var layoutKeys = _layoutKeyCollection
                    .Where(l => !string.IsNullOrEmpty(GetElementKeyByName(l)))
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

                var blockGroups = new List<BGBlockGroupModel>
                {
                    new()
                    {
                        Name = layoutGroupName,
                        Key = blockGroupKey
                    }
                };
                var blockGroupsValue = JsonSerializer.Serialize(blockGroups).GetJsonArrayFromString();

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

                var blockModels = new List<BGBlockModel>();
                var blocksJson = config.FirstOrDefault(v => v.Key == "blocks")
                    .Value.ToJson();
                var existingBlocks = JsonSerializer.Deserialize<IEnumerable<BGBlockModel>>(blocksJson) ?? [];
                blockModels.AddRange(existingBlocks);

                JsonArray blockGroupsValue = UpdateBlockGroups(config, blockModels, layoutGroupName);

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

        private JsonArray UpdateBlockGroups(IDictionary<string, object> config, List<BGBlockModel> blockModels, string layoutGroupName)
        {
            var blockGroupsJson = config.FirstOrDefault(v => v.Key == "blockGroups")
                   .Value.ToJson();
            List<BGBlockGroupModel> blockGroups = JsonSerializer.Deserialize<IEnumerable<BGBlockGroupModel>>(blockGroupsJson)?.ToList() ?? [];

            var currentblockLayoutGroupKey = blockGroups
                .FirstOrDefault(g => g.Name.Equals(layoutGroupName))?.Key;
            if (currentblockLayoutGroupKey == null)
            {
                currentblockLayoutGroupKey = Guid.NewGuid();
                blockGroups.Add(new()
                {
                    Name = layoutGroupName,
                    Key = currentblockLayoutGroupKey
                });
            }

            var croppedPictureElement = GetElementByName("croppedPicture", throwIfNotExist: false);
            var croppedPictureBlock = blockModels
                        .FirstOrDefault(b => b.ContentElementTypeKey != null
                            && b.ContentElementTypeKey.Equals(croppedPictureElement?.Key));
            if (croppedPictureElement != null && croppedPictureBlock == null)
            {
                croppedPictureBlock = new()
                {
                    ContentElementTypeKey = croppedPictureElement.Key,
                    AllowAtRoot = false,
                    AllowInAreas = true,
                    SettingsElementTypeKey = null
                };
                blockModels.Add(croppedPictureBlock);
            }

            var pictureWithCropElement = GetElementByName("pictureWithCrop", throwIfNotExist: false);
            if (pictureWithCropElement != null)
            {
                pictureWithCropElement.Variations = pictureWithCropElement.Variations == ContentVariation.CultureAndSegment || pictureWithCropElement.Variations == ContentVariation.Culture
                    ? ContentVariation.Culture
                    : ContentVariation.Nothing;

                var pictureWithCropBlock = blockModels
                    .FirstOrDefault(b => b.ContentElementTypeKey != null
                        && b.ContentElementTypeKey.Equals(pictureWithCropElement.Key));
                if (pictureWithCropBlock != null)
                {
                    var deprecatedGroupName = "Deprecated";
                    var newDeprecatedGroupKey = blockGroups
                        .FirstOrDefault(g => g.Name.Equals(deprecatedGroupName))?.Key;
                    if (newDeprecatedGroupKey == null)
                    {
                        newDeprecatedGroupKey = Guid.NewGuid();

                        blockGroups.Add(new()
                        {
                            Name = deprecatedGroupName,
                            Key = newDeprecatedGroupKey
                        });
                    }
                    pictureWithCropBlock.GroupKey = newDeprecatedGroupKey;
                }
            }

            foreach (var block in blockModels)
            {
                if (block.Areas.Any())
                {
                    foreach (var area in block.Areas)
                    {
                        var areaSpecifiedAllowance = area.SpecifiedAllowance
                            ?.Where(a => a.ElementTypeKey != pictureWithCropElement?.Key)
                            .ToList();

                        if (areaSpecifiedAllowance != null && areaSpecifiedAllowance.Count > 0)
                        {
                            var specifiedAllowance = new List<BGSpecfiedAllowanceModel>();
                            specifiedAllowance.AddRange(areaSpecifiedAllowance);

                            if (areaSpecifiedAllowance.FirstOrDefault(a => a.ElementTypeKey == croppedPictureElement?.Key) == null)
                            {
                                BGSpecfiedAllowanceModel croppedPictureElementAllowance = new()
                                {
                                    ElementTypeKey = croppedPictureElement?.Key,
                                    MinAllowed = 0
                                };
                                specifiedAllowance.Add(croppedPictureElementAllowance);
                            }

                            area.SpecifiedAllowance = specifiedAllowance;
                        }
                        block.GroupKey = currentblockLayoutGroupKey;
                    }
                }
            }

            return JsonSerializer.Serialize(blockGroups).GetJsonArrayFromString();
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
                    await CreateOrUpdateContentElements(elementTypeAlias);

                    var elementContainer = _blockContainers[BlockLayoutsName];
                    for (var index = 1; index <= 4; index++)
                    {
                        await CreateOrUpdateLayoutElementType(elementTypeAlias, $"{Constants.Prefix}layout{index}", elementContainer, index);
                    }

                    elementContainer = _blockContainers[BlockSettingsName];
                    await CreateOrUpdateSettingElements(elementTypeAlias);
                    #endregion
                }
            }
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

            #region Deprecated
            if (_deprecatedContentTypes.Length > 0)
            {
                elementContainer = _blockContainers[DeprecatedElementsName];
                foreach (var typeAlias in _deprecatedContentTypes)
                {
                    switch (typeAlias)
                    {
                        case $"{Constants.Prefix}pictureWithCrop":
                            await UpdatePictureWithCropElementType(typeAlias, typeAlias, elementContainer, culture, segment);
                            break;
                        default:
                            break;
                    }
                }
            }
            #endregion
        }

        private async Task CreateOrUpdateSettingElements(string elementTypeAlias)
        {
            var elementContainer = _blockContainers[BlockSettingsName];

            var alias = $"{Constants.Prefix}headlineSettings";
            var compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateHeadlineSettingsElementType(compareAlias, alias, elementContainer);

            alias = $"{Constants.Prefix}paragraphSettings";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateParagraphSettingsElementType(compareAlias, alias, elementContainer);

            alias = $"{Constants.Prefix}rowSettings";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateRowSettingsElementType(compareAlias, alias, elementContainer);
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

            var depricatedContainer = contentTypeService.GetContainers(DepricatedElementsName, 2).FirstOrDefault();
            if (depricatedContainer != null)
            {
                depricatedContainer.Name = DeprecatedElementsName;
                var saveAttempt = contentTypeService.SaveContainer(depricatedContainer);
                if (!saveAttempt.Success)
                {
                    logger.LogWarning("Container {name} could not be saved", DeprecatedElementsName);
                }
            }

            var _containerNames = new List<string>(_level2ContainerNames);
            if (_deprecatedContentTypes.Length > 0)
            {
                _containerNames.Add(DeprecatedElementsName);
            }

            foreach (var name in _containerNames)
            {
                var container = contentTypeService.GetContainers(name, 2).FirstOrDefault();
                if (container != null)
                {
                    _ = _blockContainers.TryAdd(container.Name ?? name, container);
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
                { _ = _blockContainers.TryAdd(container.Name ?? name, container); }
            }
        }

        private async Task CreateOrUpdateRowSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Row Settings",
                Icon = "icon-settings color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Background Color", $"{Constants.Prefix}CustomerColors", 1),
                new ("Background Image", "Media Picker", 2),
                new ("Padding", "Textstring", 3, "Any valid css value e.g.: 10px, 10px 20px, 0 etc."),
                new ("MinHeight", "Textstring", 4, "Any valid css size e.g.: 400px, 40em, 0 etc.")
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }

        private async Task CreateOrUpdateParagraphSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Paragraph Settings",
                Icon = "icon-settings color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Color", $"{Constants.Prefix}CustomerColors", 1),
                new ("MinHeight", "Textstring", 4, "Any valid css size e.g.: 400px, 40em, 0 etc.")
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }
        private async Task CreateOrUpdateHeadlineSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Headline Settings",
                Icon = "icon-heading-1 color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Color", $"{Constants.Prefix}CustomerColors", 1),
                new ("Margin", "Textstring", 2),
                new ("Size", $"{Constants.Prefix}HeadlineSizes", 3)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }

        private async Task CreateOrUpdateLayoutElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, int index)
        {
            if (elementTypeAlias != alias)
            { return; }

            var iconColor = "color-light-blue";
            var type = contentTypeService.Get(alias);
            if (type == null)
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

            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Paragraph",
                Icon = "icon-document-html",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Culture,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                UpdateCultureAndSegment(culture, segment, type);
            }
            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Text", $"{Constants.Prefix}ParagaphRTE",1, variations: ContentVariation.Culture)
            };
            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }
        private async Task CreateOrUpdateCroppedPictureElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }
            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Cropped Picture",
                Icon = "icon-document-image",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Culture,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Media Item", $"{Constants.Prefix}ImageAndCropPicker", 1),
                new ("Alternative Text", "Textstring", 2, variations : ContentVariation.Culture),
                new ("Fig Caption", "Textstring", 3, variations : ContentVariation.Culture),
                new ("Caption Color", $"{Constants.Prefix}CustomerColors", 4),
                new ("Rotation", $"{Constants.Prefix}Rotation", 5)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);

        }

        /// <summary>
        /// Use only for updates otherwise use CreateOrUpdateCroppedPictureElementType instead
        /// </summary>
        /// <param name="elementTypeAlias"></param>
        /// <param name="alias"></param>
        /// <param name="elementContainer"></param>
        /// <param name="culture"></param>
        /// <param name="segment"></param>
        /// <returns></returns>
        private async Task UpdatePictureWithCropElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture = null, bool? segment = null, bool updateOnly = true)
        {
            if (elementTypeAlias != alias)
            { return; }

            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Picture with Crop",
                Icon = "icon-document-image",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Culture,
            };

            var type = contentTypeService.Get(alias);
            List<PropertyDefinition>? propertyDefinitions = null;
            if (type != null)
            {
                type.ParentId = elementContainer.Id;
                UpdateCultureAndSegment(culture, segment, type);
            }
            else if (!updateOnly)
            {
                propertyDefinitions =
                [
                    new ("Media Item", $"{Constants.Prefix}ImageMediaPicker", 1),
                    new ("Alternative Text", "Textstring", 2, variations: ContentVariation.Culture),
                    new ("Fig Caption", "Textstring", 3, variations: ContentVariation.Culture),
                    new ("Crop Alias", $"{Constants.Prefix}CropNames", 4),
                    new ("Caption Color", $"{Constants.Prefix}CustomerColors", 5)
                ];
            }

            if (type == null)
            {
                logger.LogWarning("Element type {alias} could not be found or created", alias);
            }
            else
            {
                try
                {
                    await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "CreateOrUpdateContentElementProperties Error: {message}", ex.Message);
                }
            }
        }

        private async Task CreateOrUpdateHeadlineElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }

            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Headline",
                Icon = "icon-heading-1",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Culture,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                type.ParentId = elementContainer.Id;
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Text", $"{Constants.Prefix}LimitedHeadline", 1, "The text of the headline", ContentVariation.Culture)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
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
        private async Task<IPropertyType> GetPropertyType(PropertyDefinition definition)
        {
            var dt = await dataTypeService.GetAsync(definition.DataTypeName)
                       ?? throw new Exception($"{_errorMsgDataTypeNotFoundStart} {definition.DataTypeName}");
            var propertyType = new PropertyType(shortStringHelper, dt)
            {
                Alias = definition.Name.ToFirstLower().Replace(" ", string.Empty),
                Name = definition.Name,
                Description = definition.Description,
                Mandatory = false,
                SortOrder = definition.SortOrder,
                DataTypeId = dt.Id,
                Variations = definition.Variations
            };
            return propertyType;
        }
        private async Task CreateOrUpdateContentElementProperties(IContentType? type, IEnumerable<PropertyDefinition>? propertyDefinitions, IContentType? newType)
        {
            if (type == null && newType == null)
            { return; }

            if (type == null && newType != null)
            {
                var ctAttempt = await contentTypeService.CreateAsync(newType, CurrentUserKey);
                if (ctAttempt.Success)
                {
                    type = contentTypeService.Get(newType.Alias);
                }
                else
                {
                    throw new Exception($"{newType.Name} [{newType.Alias}] creation failed.");
                }
            }

            if (type == null)
            { return; }

            var propItems = new List<IPropertyType>();

            if (propertyDefinitions == null)
            {
                propItems.AddRange(type.PropertyTypes);
            }
            else
            {
                foreach (var definition in propertyDefinitions)
                {
                    var propertyType = await GetPropertyType(definition);
                    propItems.Add(propertyType);
                }
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

        private async Task AddOrUpdateProperties(IContentType type, IEnumerable<IPropertyType> propItems, string groupName, int groupSortOrder = 1, bool updateType = true)
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
                .FirstOrDefault(v => v.Path.InvariantEndsWith($"{folderName}${Path.DirectorySeparatorChar}{originalPartialName}"));

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
                DepricatedElementsName,
                DeprecatedElementsName
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

                var allDataTypes = await GetAllWysiwgDataTypes();

                UpdateContentTypes();

                await CreateOrUpdateContentElements(string.Empty, culture, segment);

                await CreateOrUpdateSettingElements(string.Empty);

                _dataTypeContainer ??= (await CreateDataTypeContainer())
                    ?? throw new Exception($"{ErrorMsgPrefix} Could not find data type container.");

                var parentKey = uReferenceByIdModel.ReferenceOrNull(_dataTypeContainer?.Key)
                    ?? throw new Exception($"{ErrorMsgPrefix} could not get ReferenceByIdModel for {_dataTypeContainer?.Name}!");

                await CreateOrUpdateDataTypeBlockGrid(parentKey);
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
                else if (headlineType.VariesByCulture())
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
