using System.Text.Json.Nodes;
using Json.More;
using Microsoft.Extensions.Logging;
using StackExchange.Profiling.Internal;
using Umbraco.Cms.Api.Management.Factories;
using Umbraco.Cms.Api.Management.ViewModels.DataType;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.Membership;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;
using WysiwgUmbracoCommunityExtensions.Extensions;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public class SetupService(
        ILogger<SetupService> logger,
        IContentTypeService contentTypeService,
        IDataTypeService dataTypeService,
        IDataTypeContainerService dataTypeContainerService,
        IDataTypePresentationFactory dataTypePresentationFactory,
        IShortStringHelper shortStringHelper,
        IBackOfficeSecurityAccessor backOfficeSecurityAccessor
        ) : ISetupService
    {
        #region properties
        private bool _resetExisting = false;
        private const string ErrorMsgPrefix = " Error during installation of WYSIWG Umbraco Community Extensions:";
        private readonly string _errorMsgDataTypeNotFoundStart = $"{ErrorMsgPrefix} Could not find data type:";
        private readonly string _errorMsgUpdateContentTypeStart = $"{ErrorMsgPrefix} Could not update content type";
        private readonly string _contentElementsRootContainer = $"{Constants.Prefix.ToFirstUpper()}Content Elements";
        private readonly string[] _requiredContentTypes = [
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}pictureWithCrop",
            $"{Constants.Prefix}layout1",
            $"{Constants.Prefix}layout2",
            $"{Constants.Prefix}layout3",
            $"{Constants.Prefix}layout4",
            $"{Constants.Prefix}headlineSettings",
            $"{Constants.Prefix}paragraphSettings",
            $"{Constants.Prefix}rowSettings"
        ];
        private readonly string _dtContainerName = $"{Constants.Prefix.ToFirstUpper()}DataTypes";
        private readonly string[] _requiredDataTypes = [
            $"{Constants.Prefix}ImageMediaPicker",
            $"{Constants.Prefix}CustomerColors",
            $"{Constants.Prefix}LimitedHeadline",
            $"{Constants.Prefix}ParagaphRTE",
            $"{Constants.Prefix}CropNames",
            $"{Constants.Prefix}HeadlineSizes"
        ];
        private readonly string _requiredBlockGridName = $"{Constants.Prefix}BlockGrid";
        private const string BlockElementsName = "Block Elements";
        private const string BlockLayoutsName = "Block Layouts";
        private const string BlockSettingsName = "Block Settings";
        private readonly string[] _level2ContainerNames = [BlockElementsName, BlockLayoutsName, BlockSettingsName];
        private readonly Dictionary<string, EntityContainer> _blockContainers = [];
        private readonly Guid _userKey = CurrentUserKey(backOfficeSecurityAccessor);
        private IEnumerable<IContentType> _allContentTypes = [];
        private IEnumerable<IDataType>? _existingDataTypes;
        private Guid? _containerId;
        #endregion

        #region install
        public async Task Install(bool resetExisting = false)
        {
            try
            {
                _resetExisting = resetExisting;

                _containerId = await CreateDataTypeContainer();
                if (_containerId == null)
                { throw new Exception($"{ErrorMsgPrefix} Could not find data type container."); }

                _existingDataTypes = await GetAllWysiwgDataTypes();

                await CreateDataTypesForBlockElements();

                await CreateBlockElements();

                await CreateDataTypeBlockGrid();

                logger.LogInformation("Successfully installed of WYSIWG Umbraco Community Extensions.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Installation of WYSIWG Umbraco Community Extensions failded.");
                throw;
            }

        }

        #region miscellaneous
        private async Task<IEnumerable<IDataType>?> GetAllWysiwgDataTypes()
        {
            var allDtTypes = (await dataTypeService
                .GetAllAsync())
                .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix));

            return allDtTypes;
        }

        private string GetErrorMessage(string name, bool isDataType = false)
        {
            if (isDataType)
            {
                return $"{ErrorMsgPrefix} Could not create data type {name}.";
            }
            return $"{ErrorMsgPrefix} Could not create content type {name}.";
        }

        private static Guid CurrentUserKey(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        {
            return CurrentUser(backOfficeSecurityAccessor).Key;
        }

        private static IUser CurrentUser(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        {
            return backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser
                ?? throw new InvalidOperationException("No backoffice user found");
        }
        #endregion


        #region daty types
        private async Task CreateDataTypesForBlockElements()
        {
            var missingRequiredDataTypes = _requiredDataTypes
                .Except(_existingDataTypes?.Select(d => d.Name) ?? []);

            foreach (var name in missingRequiredDataTypes)
            {
                switch (name)
                {
                    case $"{Constants.Prefix}CropNames":
                        await CreateDataTypeCropNames(name);
                        break;
                    case $"{Constants.Prefix}CustomerColors":
                        await CreateDataTypeCustomerColors(name);
                        break;
                    case $"{Constants.Prefix}ImageMediaPicker":
                        await CreateDataTypeImageMediaPicker(name);
                        break;
                    case $"{Constants.Prefix}LimitedHeadline":
                        await CreateDataTypeLimitedHeadline(name);
                        break;
                    case $"{Constants.Prefix}ParagaphRTE":
                        await CreateDataTypeParagaphRTE(name);
                        break;
                    case $"{Constants.Prefix}HeadlineSizes":
                        await CreateDataTypeHeadlineSizes(name);
                        break;
                    default:
                        break;
                }
            }
        }

        private async Task CreateDataTypeHeadlineSizes(string name)
        {

#pragma warning disable CA1861 // Avoid constant arrays as arguments
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
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
#pragma warning restore CA1861 // Avoid constant arrays as arguments
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private async Task CreateDataTypeCropNames(string name)
        {
#pragma warning disable CA1861 // Avoid constant arrays as arguments
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
                Name = name,
                EditorAlias = "Umbraco.DropDown.Flexible",
                EditorUiAlias = "Umb.PropertyEditorUi.Dropdown",
                Values = [
                    new DataTypePropertyPresentationModel {
                        Alias = "items",
                        Value = new string[] { "Square", "Landscape", "Portrait", "Original [none]" }
                    }
                ]
            };
#pragma warning restore CA1861 // Avoid constant arrays as arguments
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private async Task CreateDataTypeParagaphRTE(string name)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
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
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private async Task CreateDataTypeLimitedHeadline(string name)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
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
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private async Task CreateDataTypeCustomerColors(string name)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
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
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private async Task CreateDataTypeImageMediaPicker(string name)
        {
            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
                Name = name,
                EditorAlias = "Umbraco.MediaPicker3",
                EditorUiAlias = "Umb.PropertyEditorUi.MediaPicker",
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
    {""label"":""Square"",""alias"":""square"",""width"":1200,""height"":1200},
    {""label"":""Portrait"",""alias"":""portrait"",""width"":800,""height"":1200},
    {""label"":""Landscape"",""alias"":""landscape"",""width"":1200,""height"":800}
]".GetJsonArrayFromString()
                    },
                    //new DataTypePropertyPresentationModel {
                    //    Alias = "validationLimit",
                    //    Value = @"{""min"":0,""max"":1}"
                    //}
                ]
            };
            await CreateDataType(createDataTypeRequestModel, name);
        }

        private string GetElementKeyByName(string name)
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
                return type.Key.ToString();
            }
        }
        private async Task CreateDataTypeBlockGrid()
        {
            _allContentTypes = contentTypeService.GetAll();
            if (_allContentTypes.FirstOrDefault(t => t.Name != null && t.Name.Equals(_requiredBlockGridName)) != null)
            { return; }

            var blockGroupKey = Guid.NewGuid();
            var blockGroupsValue = @$"
            [
                {{
                    ""name"":""Layouts"",
                    ""key"":""{blockGroupKey}""
                }}
            ]".GetJsonArrayFromString();
            var rowSettingsKey = GetElementKeyByName("rowSettings");
            var paragraphKey = GetElementKeyByName("paragraph");
            var pictureWithCropKey = GetElementKeyByName("pictureWithCrop");
            var blocksValue = @$"
            [
                {{
                    ""contentElementTypeKey"":""{GetElementKeyByName("headline")}"",
                    ""allowAtRoot"": false,
                    ""allowInAreas"": true,
                    ""settingsElementTypeKey"":""{GetElementKeyByName("headlineSettings")}""
                }},
                {{
                    ""contentElementTypeKey"":""{paragraphKey}"",
                    ""allowAtRoot"":false,
                    ""allowInAreas"":true,
                    ""settingsElementTypeKey"":""{GetElementKeyByName("paragraphSettings")}""
                }},
                {{
                    ""contentElementTypeKey"":""{pictureWithCropKey}"",
                    ""allowAtRoot"":false,
                    ""allowInAreas"":true
                }},
                {{
                    ""contentElementTypeKey"":""{GetElementKeyByName("layout1")}"",
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
                    ""contentElementTypeKey"":""{GetElementKeyByName("layout2")}"",
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
                                }}
                            ]
                        }}
                    ]
                }},
                {{
                    ""contentElementTypeKey"":""{GetElementKeyByName("layout3")}"",
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
                                }}
                            ]
                        }}
                    ]
                }},
                {{
                    ""contentElementTypeKey"":""{GetElementKeyByName("layout4")}"",
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
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
                                ""elementTypeKey"":""{pictureWithCropKey}""
                                }}
                            ]
                        }}
                    ]
                }}
            ]".GetJsonArrayFromString();

            var createDataTypeRequestModel = new CreateDataTypeRequestModel
            {
                Parent = new Umbraco.Cms.Api.Management.ViewModels.ReferenceByIdModel(_containerId.GetValueOrDefault()),
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
                        Alias = "layoutStylesheet",
                        Value = "/wwwroot/styles/customBlockGrid.min.css"
                    },
                    new DataTypePropertyPresentationModel {
                        Alias = "maxPropertyWidth",
                        Value = "1200px"
                    }
                ]
            };
            await CreateDataType(createDataTypeRequestModel, _requiredBlockGridName);
        }

        private async Task CreateDataType(CreateDataTypeRequestModel createDataTypeRequestModel, string name)
        {
            var msg = GetErrorMessage(name, true);
            var attempt = await dataTypePresentationFactory.CreateAsync(createDataTypeRequestModel);

            if (!attempt.Success)
            {
                throw new Exception($"{msg} - {attempt.Status}");
            }

            Attempt<IDataType, DataTypeOperationStatus> result = await dataTypeService.CreateAsync(attempt.Result, _userKey);
            if (!result.Success)
            {
                throw new Exception(msg);
            }
        }

        private async Task<Guid> CreateDataTypeContainer()
        {
            Guid? containerId = null;
            var container = dataTypeContainerService
                .GetAllAsync()
                .Result
                .Where(c => c.Name != null && c.Name.InvariantEquals(_dtContainerName));
            if (!container.Any())
            {
                var attempt = await dataTypeContainerService.CreateAsync(Guid.NewGuid(), _dtContainerName, null, _userKey);
                if (attempt.Success)
                {
                    containerId = attempt.Result?.Key;
                }
            }
            else
            {
                containerId = container.FirstOrDefault()?.Key;
            }

            if (containerId == null)
            {
                throw new Exception($"{ErrorMsgPrefix} Could not create data type container.");
            }

            return containerId.GetValueOrDefault();
        }

        #endregion

        #region block elements
        private async Task CreateBlockElements()
        {
            CreateContentElementContainers();

            _allContentTypes = contentTypeService.GetAll()
                .Where(t => t.Alias.StartsWith(Constants.Prefix));
            var requiredExists = _allContentTypes.Select(t => t.Alias)
                .Intersect(_requiredContentTypes)
                .Count() == _requiredContentTypes.Length;
            var missingRequired = _requiredContentTypes
                .Except(_allContentTypes.Select(t => t.Alias));
            if (!_allContentTypes.Any() || !requiredExists)
            {
                foreach (var elemntTypeAlias in missingRequired)
                {
                    #region create new
                    #region Block Elements
                    var elementContainer = _blockContainers[BlockElementsName];
                    await CreateHeadlineElementType(elemntTypeAlias, $"{Constants.Prefix}headline", elementContainer);
                    await CreateParagraphElementType(elemntTypeAlias, $"{Constants.Prefix}paragraph", elementContainer);
                    await CreatePictureWithCropElementType(elemntTypeAlias, $"{Constants.Prefix}pictureWithCrop", elementContainer);
                    #endregion

                    #region Block Layouts
                    elementContainer = _blockContainers[BlockLayoutsName];
                    for (var index = 1; index <= 4; index++)
                    {
                        await CreateLayoutElementType(elemntTypeAlias, $"{Constants.Prefix}layout{index}", elementContainer, index);
                    }
                    #endregion

                    #region Block Settings
                    elementContainer = _blockContainers[BlockSettingsName];
                    await CreateHeadlineSettingsElementType(elemntTypeAlias, $"{Constants.Prefix}headlineSettings", elementContainer);
                    await CreateParagraphSettingsElementType(elemntTypeAlias, $"{Constants.Prefix}paragraphSettings", elementContainer);
                    await CreateRowSettingsElementType(elemntTypeAlias, $"{Constants.Prefix}rowSettings", elementContainer);

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
                        case "pictureWithCrop":
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
        }

        private void CreateContentElementContainers()
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

            foreach (var name in _level2ContainerNames)
            {
                var container = contentTypeService.GetContainers(name, 2).FirstOrDefault();
                if (container != null)
                { continue; }

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

        private async Task CreateRowSettingsElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Row Settings",
                Icon = "icon-settings color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Background Color", $"{Constants.Prefix}CustomerColors"),
                    new ("Background Image", "Media Picker")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreateParagraphSettingsElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Paragraph Settings",
                Icon = "icon-settings color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Color", $"{Constants.Prefix}CustomerColors")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreateHeadlineSettingsElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Headline Settings",
                Icon = "icon-heading-1 color-red",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.Nothing,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Color", $"{Constants.Prefix}CustomerColors"),
                    new ("Margin", "Textstring"),
                    new ("Size", $"{Constants.Prefix}HeadlineSizes")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreateLayoutElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer, int index)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var iconColor = "color-light-blue";
            var type = new ContentType(shortStringHelper, elementContainer.Id)
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

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (!ctAttempt.Success)
            {
                throw new Exception($"{ErrorMsgPrefix} Could not create content type {type.Name} [{alias}].");
            }
        }

        private async Task CreateParagraphElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Paragraph",
                Icon = "icon-document-html",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.CultureAndSegment,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Text", $"{Constants.Prefix}ParagaphRTE")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreatePictureWithCropElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Picture with Crop",
                Icon = "icon-document-image",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.CultureAndSegment,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Media Item", $"{Constants.Prefix}ImageMediaPicker"),
                    new ("Alternative Text", "Textstring"),
                    new ("Crop Alias", $"{Constants.Prefix}CropNames"),
                    new ("Fig Caption", "Textstring"),
                    new ("Crop Alias", $"{Constants.Prefix}CropNames"),
                    new ("Caption Color", $"{Constants.Prefix}CustomerColors")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreateHeadlineElementType(string elemntTypeAlias, string alias, EntityContainer elementContainer)
        {
            if (elemntTypeAlias != alias)
            { return; }

            var type = new ContentType(shortStringHelper, elementContainer.Id)
            {
                Alias = alias,
                Name = "Headline",
                Icon = "icon-heading-1",
                IsElement = true,
                AllowedAsRoot = false,
                Variations = ContentVariation.CultureAndSegment,
            };

            var ctAttempt = await contentTypeService.CreateAsync(type, _userKey);
            if (ctAttempt.Success)
            {
                var propertyDefinitions = new List<PropertyDefinition>()
                {
                    new ("Text", $"{Constants.Prefix}LimitedHeadline", "The text of the headline")
                };
                await CreateContentElementProperties(type, propertyDefinitions);
            }
        }

        private async Task CreateContentElementProperties(ContentType type, IEnumerable<PropertyDefinition> propertyDefinitions)
        {
            var propItems = new List<PropertyType>();
            var sortOrder = 0;
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
                        SortOrder = sortOrder,
                        DataTypeId = dt.Id
                    });
                sortOrder++;
            }

            await AddProperties(type, propItems, "Content");
        }

        private async Task AddProperties(ContentType type, IEnumerable<PropertyType> propItems, string GroupName, int groupSortOrder = 1)
        {
            PropertyTypeCollection propertyCollection = new PropertyTypeCollection(true, propItems);
            type.PropertyGroups.Add(new PropertyGroup(isPublishing: true)
            {
                Alias = GroupName.ToLower(),
                Name = GroupName,
                SortOrder = groupSortOrder,
                PropertyTypes = propertyCollection
            });
            var attempt = await contentTypeService.UpdateAsync(type, _userKey);
            if (!attempt.Success)
            {
                throw new Exception($"{_errorMsgUpdateContentTypeStart} {type.Name}.");
            }
        }
        #endregion
        #endregion

        #region uninstall
        public async Task Uninstall()
        {
            var errorStart = "Error during uninstallation of WYSIWG Umbraco Community Extensions:";

            await DeleteContentElementTypes(errorStart);

            DeleteContentTypeContainers(errorStart);

            await DeleteDataTypes(errorStart);

            await DeleteDataTypeContainer(errorStart);
        }

        private async Task DeleteDataTypeContainer(string errorStart)
        {
            EntityContainer? container = dataTypeContainerService
                .GetAllAsync()
                .Result
                .FirstOrDefault(c => c.Name != null && c.Name.InvariantEquals(_dtContainerName));
            if (container != null)
            {
                var dtcAttempt = await dataTypeContainerService.DeleteAsync(container.Key, _userKey);
                if (!dtcAttempt.Success)
                {
                    throw new Exception($"{errorStart} Could not delete data type container.");
                }
            }
        }

        private async Task DeleteDataTypes(string errorStart)
        {
            var existingDataTypes = (await GetAllWysiwgDataTypes())?
                            .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix));
            foreach (var dt in existingDataTypes ?? [])
            {
                var result = await dataTypeService.DeleteAsync(dt.Key, _userKey);
                if (!result.Success)
                {
                    throw new Exception($"{errorStart} Could not delete data type: {dt.Name}");
                }
            }
        }

        private void DeleteContentTypeContainers(string errorStart)
        {
            Attempt<OperationResult?> attempt;
            EntityContainer? container;
            foreach (var name in _level2ContainerNames)
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

        private async Task DeleteContentElementTypes(string errorStart)
        {
            var allContentTypes = contentTypeService.GetAll()
                            .Where(t => t.Alias.StartsWith(Constants.Prefix));

            foreach (var type in allContentTypes ?? [])
            {
                if (type == null)
                { continue; }

                var result = await contentTypeService.DeleteAsync(type.Key, _userKey);
                if (result != ContentTypeOperationStatus.Success)
                {
                    throw new Exception($"{errorStart} Could not delete content type:  {type.Name}");
                }
            }
        }

        #endregion
    }
}
