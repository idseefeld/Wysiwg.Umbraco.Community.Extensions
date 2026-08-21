using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Profiling.Internal;
using Umbraco.Cms.Api.Management.ViewModels.DataType;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Configuration;
using Umbraco.Cms.Core.Extensions;
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
using static Umbraco.Cms.Core.PropertyEditors.ColorPickerConfiguration;
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
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
        IHostEnvironment hostEnvironment,
        IUmbracoVersion umbracoVersion
        ) : ISetupService
    {
        #region properties
        private const string ErrorMsgPrefix = "Error during installation of WYSIWG Umbraco Community Extensions:";
        private readonly string _errorMsgDataTypeNotFoundStart = $"{ErrorMsgPrefix} Could not find data type:";
        private readonly string _errorMsgUpdateContentTypeStart = $"{ErrorMsgPrefix} Could not update content type";
        private readonly string _contentElementsRootContainer = $"{Constants.Prefix.ToFirstUpper()}Content Elements";

        private readonly ContentVariation _contentVariationDefault = ContentVariation.Nothing;
        private const bool EnableVaryByCultureDefault = false;
        private const bool EnableVaryBySegmentDefault = false; //default = false, because from v15.4.0 Umbraco does not support segment variation on element types

        private readonly string[] _requiredContentTypes = [
            $"{Constants.Prefix}callToAction",
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}croppedPicture",
            $"{Constants.Prefix}layout1",
            $"{Constants.Prefix}layout2",
            $"{Constants.Prefix}layout3",
            $"{Constants.Prefix}layout4",
            $"{Constants.Prefix}callToActionSettings",
            $"{Constants.Prefix}headlineSettings",
            $"{Constants.Prefix}paragraphSettings",
            $"{Constants.Prefix}rowSettings",
            // v18.1.0
            $"{Constants.Prefix}genericComponent"
        ];
        private readonly string[] _requiredDataTypes = [
            $"{Constants.Prefix}CallToActionLabel",
            $"{Constants.Prefix}CallToActionOnClick",
            $"{Constants.Prefix}HeadlineSizes",
            $"{Constants.Prefix}LimitedHeadline",
            $"{Constants.Prefix}ParagaphRTE",
            $"{Constants.Prefix}CustomerColors",
            $"{Constants.Prefix}ImageAndCropPicker",
            $"{Constants.Prefix}Rotation",
            // v18.1.0
            $"{Constants.Prefix}ComponentPicker"
        ];
        private readonly Dictionary<string, string[]> _versionNeedUpdateContentTypes = new()
        {
            {"17.0.0", [
                $"{Constants.Prefix}headline",
                $"{Constants.Prefix}paragraph",
                $"{Constants.Prefix}croppedPicture",
                $"{Constants.Prefix}paragraphSettings",
                $"{Constants.Prefix}rowSettings",
            ]},
            {"18.0.0", [
                $"{Constants.Prefix}callToActionSettings",
                ]},
            {"18.1.0", []}
        };
        private readonly Dictionary<string, string[]> _versionNewContentTypes = new()
        {
            {"17.0.0", [
                $"{Constants.Prefix}headline",
                $"{Constants.Prefix}paragraph",
                $"{Constants.Prefix}croppedPicture",
                $"{Constants.Prefix}paragraphSettings",
                $"{Constants.Prefix}rowSettings",
            ]},
            {"18.0.0", [
                $"{Constants.Prefix}callToActionSettings",
                ]},
            {"18.1.0", [
                $"{Constants.Prefix}genericComponent"
                ]}
        };

        private readonly string[] _layoutKeyCollection = ["layout1", "layout2", "layout3", "layout4"];

        private string[] _deprecatedContentTypes = [$"{Constants.Prefix}pictureWithCrop"];
        private readonly string _dtContainerName = $"{Constants.Prefix.ToFirstUpper()}DataTypes";

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
        private bool _isUpgrading = false;
        private bool _isUninstalling = false;
        private bool _restoreAll = false;
        private string? _blockGridCssPath;
        #endregion

        #region install
        public async Task Install(bool restoreAll = false)
        {
            _restoreAll = restoreAll;
            try
            {
                var versionStatus = await GetVersionStatus();
                if (_isInstalling || _isUninstalling || _isUpgrading || versionStatus == VersionStatus.UpToDate)
                { return; }

                _isInstalling = versionStatus == VersionStatus.Install;
                _isUpgrading = versionStatus == VersionStatus.Update;

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

                await RemoveObsoleteDataTypes();

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
                _isUpgrading = false;
            }
        }

        #region data types
        private async Task CreateOrUpdateDataTypesForBlockElements(uReferenceByIdModel parent)
        {
            foreach (var name in _requiredDataTypes)
            {
                switch (name)
                {
                    case $"{Constants.Prefix}CallToActionLabel":
                        await CreateDataTypeCallToActionLabel(name, parent);
                        break;
                    case $"{Constants.Prefix}CallToActionOnClick":
                        await CreateDataTypeCallToActionOnClick(name, parent);
                        break;
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
                    case $"{Constants.Prefix}ComponentPicker":
                        await CreateDataTypeComponentPicker(name, parent);
                        break;
                    default:
                        break;
                }
            }
            _existingDataTypes = [.. await GetAllWysiwgDataTypes()];
        }

        private async Task CreateDataTypeComponentPicker(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Wysiwg.ComponentPicker",
                EditorUiAlias = "wysiwg.PropertyEditorUi.ComponentPicker",
                Values = []
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
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

        private async Task<bool> IsRteUpdateRequired()
        {
            bool required = true;
            var rteDataType = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals($"{Constants.Prefix}ParagaphRTE"));
            if (rteDataType != null)
            {
                string[] extensionsList = GetxtensionsList();
                foreach (var extension in extensionsList)
                {
                    var config = rteDataType.ConfigurationData;
                    var extensions = config.FirstOrDefault(v => v.Key == "extensions").Value.ToJson();
                    var currentExtensionsList = JsonSerializer.Deserialize<IEnumerable<string>>(extensions) ?? [];
                    if (!currentExtensionsList.Contains(extension))
                    {
                        return required;
                    }
                }
                required = false;
            }
            return required;
        }

        private string[] GetxtensionsList()
        {
            bool isVersion16 = umbracoVersion.Version.Major == 16;
            bool isVersion164 = umbracoVersion.Version.Major == 16 && umbracoVersion.Version.Minor >= 4;
            bool isVersion17 = umbracoVersion.Version.Major >= 17;

#if DEBUG
            //isVersion17 = false; // Temporarily disable specific configuration for Umbraco 17 until further testing is done.
#endif
            return isVersion164 || isVersion17
                ? ["Umb.Tiptap.Blockquote", "Umb.Tiptap.Bold", "Umb.Tiptap.Link", "Umb.Tiptap.Heading", "Umb.Tiptap.HorizontalRule", "Umb.Tiptap.Italic", "Umb.Tiptap.BulletList", "Umb.Tiptap.OrderedList", "Umb.Tiptap.Subscript", "Umb.Tiptap.Superscript", "Umb.Tiptap.TextAlign", "Umb.Tiptap.Underline"]
                : ["Umb.Tiptap.RichTextEssentials", "Umb.Tiptap.Link", "Umb.Tiptap.Subscript", "Umb.Tiptap.Superscript", "Umb.Tiptap.TextAlign", "Umb.Tiptap.Underline"];
        }

        private async Task CreateDataTypeParagaphRTE(string name, uReferenceByIdModel parent)
        {
            string[] extensionsList = GetxtensionsList();
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
                        Value = extensionsList
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

        private async Task CreateDataTypeCallToActionLabel(string name, uReferenceByIdModel parent)
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
                        Value = 80
                    }
                ]
            };
            await CreateOrUpdateDataType(createDataTypeRequestModel);
        }

        private async Task CreateDataTypeCallToActionOnClick(string name, uReferenceByIdModel parent)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.MultiUrlPicker",
                EditorUiAlias = "Umb.PropertyEditorUi.MultiUrlPicker",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "minNumber",
                        Value = 0
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxNumber",
                        Value = 1
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "ignoreUserStartNodes",
                        Value = false
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "overlaySize",
                        Value = ""
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "hideAnchor",
                        Value = false
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "allowCultureSpecificDocumentLinks",
                        Value = false
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
            List<ColorPickerItem> defaultItems = new List<ColorPickerItem>()
            {
                new() { Value = "d60000", Label = "" },
                new() { Value = "029400", Label = "" },
                new() { Value = "5c9aff", Label = "" },
                new() { Value = "fee648", Label = "" },
                new() { Value = "ffffff", Label = "" },
                new() { Value = "000", Label = "" },
                new() { Value = Constants.TransparentColorValue, Label = "" }
            };
            string itemsValueString = JsonSerializer
                .Serialize(defaultItems)
                .ToLowerInvariant();
            var itemsValue = itemsValueString.GetJsonArrayFromString();

            IDataType? dataType = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(name));
            if (dataType != null)
            {
                if (dataType.ConfigurationObject is ColorPickerConfiguration existingValues)
                {
                    foreach (var item in defaultItems)
                    {
                        var existingItem = existingValues.Items.FirstOrDefault(i => i.Value != null && i.Value.Equals(item.Value));
                        if (existingItem == null)
                        {
                            existingValues.Items.Add(item);
                        }
                    }

                    itemsValueString = JsonSerializer
                        .Serialize(existingValues.Items)
                        .ToLowerInvariant();
                    itemsValue = itemsValueString.GetJsonArrayFromString();
                }
            }

            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = parent,
                Name = name,
                EditorAlias = "Umbraco.ColorPicker",
                EditorUiAlias = "Umb.PropertyEditorUi.ColorPicker",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "useLabel",
                        Value = false
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "items",
                        Value = itemsValue
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

        private async Task CreateOrUpdateDataType(DataTypeModelBase dataTypeRequestModel, IDataType? dataType = null, uReferenceByIdModel? parent = null)
        {
            if (dataTypeRequestModel == null)
            { return; }

            var msg = GetErrorMessage(dataTypeRequestModel.Name, true);
            Attempt<IDataType, DataTypeOperationStatus> attempt;

            dataType ??= await dataTypeService.GetAsync(dataTypeRequestModel.Name);

            if (dataType == null)
            {
                if (dataTypeRequestModel is not CreateDataTypeRequestModel requestModel)
                {
                    requestModel = new CreateDataTypeRequestModel
                    {
                        Parent = parent ?? throw new Exception($"{msg} Parent reference is missing for creation of data type."),
                        Name = dataTypeRequestModel.Name,
                        EditorAlias = dataTypeRequestModel.EditorAlias,
                        EditorUiAlias = dataTypeRequestModel.EditorUiAlias,
                        Values = dataTypeRequestModel.Values
                    };
                }

                var configuration = requestModel
                    .Values.ToDictionary(v => v.Alias, v => v.Value ?? new object())
                    ?? [];

                IDataEditor? editor = new DataEditor(dataValueEditorFactory)
                {
                    Alias = requestModel.EditorAlias,
                    DefaultConfiguration = configuration
                };

                dataType = new DataType(editor, jsonSerializer, _dataTypeContainer?.Id ?? -1)
                {
                    Name = requestModel.Name,
                    EditorUiAlias = requestModel.EditorUiAlias,
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

                dataType.SetParent(_dataTypeContainer);
                dataType.Name = dataTypeRequestModel.Name;
                dataType.Editor = new DataEditor(dataValueEditorFactory)
                {
                    Alias = dataTypeRequestModel.EditorAlias,
                    DefaultConfiguration = values
                };
                dataType.EditorUiAlias = dataTypeRequestModel.EditorUiAlias;
                dataType.ConfigurationData = values;

                attempt = await dataTypeService.UpdateAsync(dataType, CurrentUserKey);
                if (!attempt.Success)
                {
                    throw new Exception($"{msg} Status: {attempt.Status} Exception: {attempt.Exception?.Message}");
                }
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

        private async Task RemoveObsoleteDataTypes()
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
            CopyBlockGridStyleSheet();

            UpdateAllExistingContentTypes();

            _existingDataTypes = [.. await dataTypeService.GetAllAsync()];
            var current = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(_requiredBlockGridName));

            IDictionary<string, object>? config = current?.ConfigurationData;
            string layoutStylesheet = config?.FirstOrDefault(v => v.Key == "layoutStylesheet").Value?.ToString()
                ?? _blockGridCssPath
                ?? string.Empty;
            var layoutGroupName = "Layouts";
            JsonArray blocksValue;
            JsonArray blockGroupsValue;
            Guid blockLayoutGroupKey;
            List<BGBlockGroupModel>? blockGroupsModels;

            if (current == null)
            {
                blockLayoutGroupKey = Guid.NewGuid();
                blocksValue = CreateBlocksValue(blockLayoutGroupKey).GetJsonArrayFromString();
                blockGroupsModels = new List<BGBlockGroupModel> { new() { Name = layoutGroupName, Key = blockLayoutGroupKey } };
            }
            else if (config != null)
            {
                blockGroupsModels = JsonSerializer.Deserialize<List<BGBlockGroupModel>>(config.FirstOrDefault(v => v.Key == "blockGroups").Value?.ToString() ?? "[]");
                var existingblockLayoutGroupKey = blockGroupsModels?.FirstOrDefault(g => g.Name != null && g.Name.Equals(layoutGroupName))?.Key;
                blockLayoutGroupKey = existingblockLayoutGroupKey ?? Guid.NewGuid();
                var addNewGroup = existingblockLayoutGroupKey == null;
                if (addNewGroup)
                {
                    blockGroupsModels = new List<BGBlockGroupModel> { new() { Name = layoutGroupName, Key = blockLayoutGroupKey } };
                }
                blocksValue = UpdateBlockModels(config, layoutGroupName, blockLayoutGroupKey, addNewGroup, blockGroupsModels).GetJsonArrayFromString();
            }
            else
            {
                throw new Exception($"{ErrorMsgPrefix} Could not find existing Block Grid data type, nor create a new one.");
            }

            blockGroupsValue = JsonSerializer.Serialize(blockGroupsModels).GetJsonArrayFromString();

            var updateDataTypeRequestModel = GetUpdateDataTypeRequestModel(blocksValue, blockGroupsValue, layoutStylesheet);
            await CreateOrUpdateDataType(updateDataTypeRequestModel, current, parent);

            if (config != null)
            {
                _existingDataTypes = [.. await dataTypeService.GetAllAsync()];
                var updated = _existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals(_requiredBlockGridName));
            }
        }

        private UpdateDataTypeRequestModel GetUpdateDataTypeRequestModel(JsonArray blocksValue, JsonArray blockGroupsValue, string layoutStylesheet)
        {
            return new UpdateDataTypeRequestModel
            {
                Name = _requiredBlockGridName,
                EditorAlias = "Umbraco.BlockGrid",
                EditorUiAlias = "Umb.PropertyEditorUi.BlockGrid",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "gridColumns",
                        Value = 12
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "blocks",
                        Value = JsonSerializer.Serialize(blocksValue).GetJsonArrayFromString()
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "blockGroups",
                        Value = JsonSerializer.Serialize(blockGroupsValue).GetJsonArrayFromString()
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
        }

        private List<BGBlockModel> GetBlockValue(IDictionary<string, object> config)
        {
            var blockModels = new List<BGBlockModel>();
            var blocksJson = config.FirstOrDefault(v => v.Key == "blocks").Value.ToJson();
            var existingBlocks = JsonSerializer.Deserialize<IEnumerable<BGBlockModel>>(blocksJson) ?? [];
            blockModels.AddRange(existingBlocks);

            return blockModels;
        }

        internal string CreateBlocksValue(Guid layoutGroupKey)
        {
            var rowSettingsKey = GetElementKeyByName("rowSettings");
            var paragraphKey = GetElementKeyByName("paragraph");
            var paragraphSettingsKey = GetElementKeyByName("paragraphSettings");
            var imageAndCropPickerKey = GetElementKeyByName("croppedPicture");
            var headlineKey = GetElementKeyByName("headline");
            var headlineSettingsKey = GetElementKeyByName("headlineSettings");
            var ctaKey = GetElementKeyByName("callToAction");
            var ctaSettingsKey = GetElementKeyByName("callToActionSettings");
            var genericComponentKey = GetElementKeyByName("genericComponent");

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
                        ""contentElementTypeKey"":""{ctaKey}"",
                        ""allowAtRoot"": false,
                        ""allowInAreas"": true,
                        ""settingsElementTypeKey"":""{ctaSettingsKey}""
                    }},
                    {{
                        ""contentElementTypeKey"":""{genericComponentKey}"",
                        ""allowAtRoot"": false,
                        ""allowInAreas"": true
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[0]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{layoutGroupKey}"",
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
                        ""groupKey"":""{layoutGroupKey}"",
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
                                    }}
                                ]
                            }}
                        ]
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[2]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{layoutGroupKey}"",
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
                                    }}
                                ]
                            }}
                        ]
                    }},
                    {{
                        ""contentElementTypeKey"":""{layoutKeys[3]}"",
                        ""allowAtRoot"":true,
                        ""allowInAreas"":false,
                        ""groupKey"":""{layoutGroupKey}"",
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
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
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{ctaKey}""
                                    }},
                                    {{
                                    ""minAllowed"":0,
                                    ""elementTypeKey"":""{genericComponentKey}""
                                    }}
                                ]
                            }}
                        ]
                    }}
                ]";
            return blocksValueJson;
        }

        private string UpdateBlockModels(IDictionary<string, object> config, string layoutGroupName, Guid blockLayoutGroupKey, bool addNewGroupKey, List<BGBlockGroupModel>? blockGroups)
        {
            List<BGBlockModel> blockModels = GetBlockValue(config);

            #region for backward compatibility
            blockGroups ??= [];

            #region backward compatibility for pictureWithCrop element
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
            #endregion
            #endregion

            var callToActionElement = GetElementByName("callToAction", throwIfNotExist: false);
            var callToActionSettingsElement = GetElementByName("callToActionSettings", throwIfNotExist: false);
            var callToActionBlock = blockModels
                        .FirstOrDefault(b => b.ContentElementTypeKey != null
                            && b.ContentElementTypeKey.Equals(callToActionElement?.Key));
            if (callToActionElement != null && callToActionBlock == null)
            {
                callToActionBlock = new()
                {
                    ContentElementTypeKey = callToActionElement.Key,
                    AllowAtRoot = false,
                    AllowInAreas = true,
                    SettingsElementTypeKey = callToActionSettingsElement?.Key
                };
                blockModels.Add(callToActionBlock);
            }


            var genericComponentElement = GetElementByName("genericComponent", throwIfNotExist: false);
            var genericComponentBlock = blockModels
                        .FirstOrDefault(b => b.ContentElementTypeKey != null
                            && b.ContentElementTypeKey.Equals(genericComponentElement?.Key));
            if (genericComponentElement != null && genericComponentBlock == null)
            {
                genericComponentBlock = new()
                {
                    ContentElementTypeKey = genericComponentElement.Key,
                    AllowAtRoot = false,
                    AllowInAreas = true,
                    SettingsElementTypeKey = null
                };
                blockModels.Add(genericComponentBlock);
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

                            if (areaSpecifiedAllowance.FirstOrDefault(a => a.ElementTypeKey == genericComponentElement?.Key) == null)
                            {
                                BGSpecfiedAllowanceModel genericComponentElementAllowance = new()
                                {
                                    ElementTypeKey = genericComponentElement?.Key,
                                    MinAllowed = 0
                                };
                                specifiedAllowance.Add(genericComponentElementAllowance);
                            }

                            if (areaSpecifiedAllowance.FirstOrDefault(a => a.ElementTypeKey == callToActionElement?.Key) == null)
                            {
                                BGSpecfiedAllowanceModel callToActionElementAllowance = new()
                                {
                                    ElementTypeKey = callToActionElement?.Key,
                                    MinAllowed = 0
                                };
                                specifiedAllowance.Add(callToActionElementAllowance);
                            }

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
                        block.GroupKey = blockLayoutGroupKey;
                    }
                }
            }

            return JsonSerializer.Serialize(blockModels);
        }

        #endregion

        #region block elements
        private void UpdateAllExistingContentTypes()
        {
            _allContentTypes = [.. contentTypeService.GetAll().Where(t => t.Alias.StartsWith(Constants.Prefix))];
        }

        private IEnumerable<string> GetContentTypesToUpdate()
        {
            foreach (var version in _versionNewContentTypes.Keys.Reverse())
            {
                var newContentTypes = _versionNewContentTypes[version];
                var requiredExists = _allContentTypes
                    .Select(t => t.Alias)
                    .Intersect(newContentTypes)
                    .Count() == newContentTypes.Length;
                if (requiredExists)
                {
                    return newContentTypes;
                }
            }

            return Array.Empty<string>();
        }

        private async Task CreateBlockElements()
        {
            CreateOrUpdateContentElementContainers();

            UpdateAllExistingContentTypes();

            IEnumerable<string> _needUpdateContentTypes = GetContentTypesToUpdate();

            var requiredExists = _allContentTypes
                    .Select(t => t.Alias)
                    .Intersect(_requiredContentTypes)
                    .Count() == _requiredContentTypes.Length + _needUpdateContentTypes.Count();
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

            var alias = $"{Constants.Prefix}callToAction";
            var compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateCallToActionElementType(compareAlias, alias, elementContainer, culture, segment);

            alias = $"{Constants.Prefix}headline";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
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

            // v18.1.0
            alias = $"{Constants.Prefix}genericComponent";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateGenericComponentElementType(compareAlias, alias, elementContainer);

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

            alias = $"{Constants.Prefix}callToActionSettings";
            compareAlias = string.IsNullOrEmpty(elementTypeAlias)
                ? alias
                : elementTypeAlias;
            await CreateOrUpdateCallToActionSettingsElementType(compareAlias, alias, elementContainer);
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

        private async Task CreateOrUpdateCallToActionSettingsElementType(string elementTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elementTypeAlias != alias)
            { return; }

            var type = contentTypeService.Get(alias);
            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Call to Action Settings",
                Icon = "icon-reception color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Color", $"{Constants.Prefix}CustomerColors", 1),
                new ("Background Color", $"{Constants.Prefix}CustomerColors", 2),
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
                Variations = _contentVariationDefault,
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
                Variations = _contentVariationDefault,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Media Item", $"{Constants.Prefix}ImageAndCropPicker", 1, "Select image and crop", isMandatory: true),
                new ("Alternative Text", "Textstring", 2, variations : ContentVariation.Culture),
                new ("Fig Caption", "Textstring", 3, variations : ContentVariation.Culture),
                new ("Caption Color", $"{Constants.Prefix}CustomerColors", 4),
                new ("Rotation", $"{Constants.Prefix}Rotation", 5)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);

        }

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
                Variations = _contentVariationDefault,
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
                Variations = _contentVariationDefault,
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

        private async Task CreateOrUpdateGenericComponentElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture = false, bool? segment = false)
        {
            if (elementTypeAlias != alias)
            { return; }

            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Generic Component",
                Icon = "icon-plugin",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = _contentVariationDefault,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                type.ParentId = elementContainer.Id;
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Component Picker", $"{Constants.Prefix}ComponentPicker", 1, "Selected component name", variations: ContentVariation.Nothing)
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }

        private async Task CreateOrUpdateCallToActionElementType(string elementTypeAlias, string alias, EntityContainer elementContainer, bool? culture, bool? segment)
        {
            if (elementTypeAlias != alias)
            { return; }

            var newType = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Call to Action",
                Icon = "icon-reception",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = _contentVariationDefault,
            };
            var type = contentTypeService.Get(alias);
            if (type != null)
            {
                type.ParentId = elementContainer.Id;
                UpdateCultureAndSegment(culture, segment, type);
            }

            var propertyDefinitions = new List<PropertyDefinition>()
            {
                new ("Label", $"{Constants.Prefix}CallToActionLabel", 1, "The button label", ContentVariation.Culture, true),
                new ("Action", $"{Constants.Prefix}CallToActionOnClick", 1, "The onClick javascript method or url", ContentVariation.Culture, alias: "actionOrUrl")
            };

            await CreateOrUpdateContentElementProperties(type, propertyDefinitions, newType);
        }

        private static void UpdateCultureAndSegment(bool? culture, bool? segment, IContentType type)
        {
            type.Variations = ContentVariation.Nothing;
            var enableVaryByCulture = culture ?? EnableVaryByCultureDefault;
            var enableVaryBySegment = segment ?? EnableVaryBySegmentDefault;
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
                Alias = definition.Alias ?? definition.Name.ToFirstLower().Replace(" ", string.Empty),
                Name = definition.Name,
                Description = definition.Description,
                Mandatory = definition.IsMandatory,
                SortOrder = definition.SortOrder,
                DataTypeId = dt.Id,
                Variations = definition.Variations,
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
                    try
                    {
                        var propertyType = await GetPropertyType(definition);

                        propItems.Add(propertyType);
                    }
                    catch (Exception)
                    {

                        throw;
                    }
                }
            }
            await AddOrUpdateProperties(type, propItems, "Content");
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

        #endregion

        #endregion

        #region miscellaneous
        private void CopyBlockGridStyleSheet()
        {
            var contentRootPath = hostEnvironment.ContentRootPath;
            var webRootPath = hostEnvironment.MapPathContentRoot("~/");
            var dest = GetBlockGridStyleSheetPath();
            try
            {
                var destExists = System.IO.File.Exists(dest);
                if (_restoreAll && destExists)
                {
                    destExists = false;
                    System.IO.File.Delete(dest);
                }

                string? sourceContent = null;
                if (string.IsNullOrEmpty(sourceContent))
                {
                    sourceContent = CssSource.SOURCE;
                }

                if (!destExists && !string.IsNullOrEmpty(sourceContent))
                {
                    System.IO.File.WriteAllText(dest, sourceContent);
                    _blockGridCssPath = Constants.BlockGridCssPath;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Could not copy BlockGrid CSS file {message}", ex.Message);
            }
        }

        private void DeleteBlockGridStyleSheet()
        {
            var dest = GetBlockGridStyleSheetPath();
            try
            {
                if (System.IO.File.Exists(dest))
                {
                    System.IO.File.Delete(dest);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Could not delete BlockGrid CSS file {message}", ex.Message);
            }
        }
        private string GetBlockGridStyleSheetPath()
        {
            var webRootPath = hostEnvironment.MapPathContentRoot("~/");
            var cssPath = Path.Combine(webRootPath, "wwwroot", "styles");
            if (!Directory.Exists(cssPath))
            {
                _ = Directory.CreateDirectory(cssPath);
            }
            var cssFilePath = Path.Combine(cssPath, "wysiwyg-blockgrid.min.css");
            return cssFilePath;
        }

        private async Task SwitchPartialViews(bool restoreOriginal = false)
        {
            var folderName = "blockgrid";
            var allPartialViews = (await partialViewService.GetAllAsync())
                ?.Where(v => v.Path.InvariantContains(folderName))
                .ToArray();
            if (allPartialViews == null)
            { return; }

            var originalPartialName = "items.cshtml";
            var backupPartialName = "backup-items.cshtml";

            var comparePathPart = $"{folderName}{Path.DirectorySeparatorChar}{originalPartialName}";
            comparePathPart = Path.Combine(folderName, originalPartialName);
            var original = allPartialViews
                .FirstOrDefault(v => v.Path.InvariantEndsWith(comparePathPart));

            comparePathPart = $"{folderName}{Path.DirectorySeparatorChar}{backupPartialName}";
            comparePathPart = Path.Combine(folderName, backupPartialName);
            var backup = allPartialViews
                .FirstOrDefault(v => v.Path.InvariantEndsWith(comparePathPart));

            if (restoreOriginal || _restoreAll)
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
        private void CompleteUpdate()
        {

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

            var updateRteRequired = await IsRteUpdateRequired();
            if (updateRteRequired)
            { return VersionStatus.Update; }

            if (!DataTypeExists("Rotation"))
            { return VersionStatus.Update; }

            UpdateAllExistingContentTypes();

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

        private bool MinHeightPropertyExists(string elementName, string propertyName)
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

            return rVal ?? [];
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


        #region uninstall
        public async Task Uninstall()
        {
            if (_isInstalling || _isUninstalling || _isUpgrading)
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

                DeleteBlockGridStyleSheet();
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

        #region fix after Umbraco or package upgrade

        public async Task FixUpgrade(bool? culture, bool? segment)
        {
            if (_isInstalling || _isUninstalling)
            { return; }

            _isInstalling = true;
            try
            {
                CreateOrUpdateContentElementContainers();

                var allDataTypes = await GetAllWysiwgDataTypes();

                UpdateAllExistingContentTypes();

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

            UpdateAllExistingContentTypes();

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
