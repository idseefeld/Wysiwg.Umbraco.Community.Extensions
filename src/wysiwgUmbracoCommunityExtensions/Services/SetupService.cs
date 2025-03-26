using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Serialization;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Services.OperationStatus;
using Umbraco.Cms.Core.Strings;
using Umbraco.Extensions;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public class SetupService(
        //IIdentity identity, //these are not injectable in here. See WysiwgUmbracoCommunityExtensionsApiComposer.Compose() for how to inject them
        ILogger<SetupService> logger,
        IContentTypeService contentTypeService,
        IDataTypeService dataTypeService,
        IDataTypeContainerService dataTypeContainerService,
        IUserService userService,
        IEnumerable<IDataEditor> dataEditors,
        IConfigurationEditorJsonSerializer serializer,
        IShortStringHelper shortStringHelper,
        IUserGroupService userGroupService
        ) : ISetupService
    {
        private bool _resetExisting = false;
        private readonly string[] _requiredContentTypes = [
            $"{Constants.Prefix}headline",
            $"{Constants.Prefix}paragraph",
            $"{Constants.Prefix}pictureWithCrop",
            $"{Constants.Prefix}layout1",
            $"{Constants.Prefix}layout2",
            $"{Constants.Prefix}layout3",
            $"{Constants.Prefix}layout4",
            $"{Constants.Prefix}HeadlineSettings",
            $"{Constants.Prefix}ParagraphSettings",
            $"{Constants.Prefix}RowSettings"
        ];
        public async Task Install(bool resetExisting = false)
        {
            try
            {
                _resetExisting = resetExisting;

                var containerId = await CreateDataTypeContainer();

                var existingDataTypes = await GetAllWysiwgDataTypes();

                await CreateDataTypesForBlockElements(containerId, existingDataTypes);

                await CreateBlockElements();

                await CreateDataTypeBlockGrid(containerId, existingDataTypes);

                logger.LogInformation("Successfully installed of WYSIWG Umbraco Community Extensions.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Installation of WYSIWG Umbraco Community Extensions failded.");
                throw;
            }

        }
        private async Task<IEnumerable<IDataType>?> GetAllWysiwgDataTypes()
        {
            var allDtTypes = (await dataTypeService
                .GetAllAsync())
                .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix));

            return allDtTypes;
        }
        private async Task CreateDataTypesForBlockElements(int containerId, IEnumerable<IDataType>? existingDataTypes)
        {
            foreach (var dt in existingDataTypes)
            {

            }
        }
        private async Task CreateBlockElements()
        {
            var userKey = await GetUserKey()
                ?? throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not get user key.");
            Attempt<OperationResult<OperationResultType, EntityContainer>?> containerAttempt;
            var containerName = "Wysiwg65";
            var level = 1;
            EntityContainer? rootContainer = contentTypeService.GetContainers(containerName, level).FirstOrDefault();
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
                throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not create root content type folder.");
            }

            level = 2;
            const string blockElementsName = "Block Elements";
            const string blockLayoutsName = "Block Layouts";
            const string blockSettingsName = "Block Settings";
            var level2ContainerNames = new string[] { blockElementsName, blockLayoutsName, blockSettingsName };
            Dictionary<string, EntityContainer> blockContainers = [];
            foreach (var name in level2ContainerNames)
            {
                var container = contentTypeService.GetContainers(name, level).FirstOrDefault();
                containerAttempt = contentTypeService.CreateContainer(rootContainer.Id, Guid.NewGuid(), name);
                if (containerAttempt.Success)
                {
                    container = containerAttempt.Result?.Entity;
                }
                if (container == null)
                {
                    throw new Exception($"Error during installation of WYSIWG Umbraco Community Extensions: Could not create {name} folder.");
                }
                else
                {
                    blockContainers.Add(name, container);
                }
            }

            var allContentTypes = contentTypeService.GetAll()
                .Where(t => t.Alias.StartsWith(Constants.Prefix));
            var requiredExists = allContentTypes.Select(t => t.Alias)
                .Intersect(_requiredContentTypes)
                .Count() == _requiredContentTypes.Length;
            var missingRequired = _requiredContentTypes
                .Except(allContentTypes.Select(t => t.Alias));
            if (!allContentTypes.Any() || !requiredExists)
            {
                #region create new
                #region Block Elements
                var elementContainer = blockContainers[blockElementsName];
                var headline = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = Constants.Prefix + "headline",
                    Name = "Headline",
                    Icon = "icon-header"
                };
                var ctAttempt = await contentTypeService.CreateAsync(headline, userKey);
                if (ctAttempt.Success)
                {
                    var alias = $"{Constants.Prefix}headlineText";
                    var dt = await dataTypeService.GetAsync(alias)
                        ?? throw new Exception($"Error during installation of WYSIWG Umbraco Community Extensions: Could not find data type: {alias}");

                    var propItems = new List<PropertyType>
                    {
                        new PropertyType(shortStringHelper, dt)
                        {
                            Alias = alias,
                            Name = "Text",
                            Description = "The text of the headline",
                            Mandatory = false,
                            SortOrder = 1,
                            DataTypeId = dt.Id
                        }
                    };
                    PropertyTypeCollection propertyCollection = new PropertyTypeCollection(true, propItems);
                    headline.PropertyGroups.Add(new PropertyGroup(isPublishing: true)
                    {
                        Name = "Content",
                        SortOrder = 1,
                        PropertyTypes = propertyCollection
                    });
                    var attempt = await contentTypeService.UpdateAsync(headline, userKey);
                    if (!attempt.Success)
                    {
                        throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not update content type Headline.");
                    }
                }
                /*
                var paragraph = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = Constants.Prefix + "paragraph",
                    Name = "Paragraph",
                    Icon = "icon-paragraph"
                };
                contentTypeService.Save(paragraph);
                var pictureWithCrop = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = Constants.Prefix + "pictureWithCrop",
                    Name = "Picture with Crop",
                    Icon = "icon-picture"
                };
                contentTypeService.Save(pictureWithCrop);
                #endregion

                #region Block Layouts
                elementContainer = blockContainers[blockLayoutsName];
                var layout1 = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = Constants.Prefix + "layout1",
                    Name = "Layout 1",
                    Icon = "icon-layout"
                };
                contentTypeService.Save(layout1);
                var layout2 = new ContentType(shortStringHelper, elementContainer.Id)
                {
                    Alias = Constants.Prefix + "layout2",
                    Name = "Layout 2",
                    Icon = "icon-layout"
                };
                */

                #endregion
                #endregion
            }
            else if (_resetExisting)
            {
                #region reset existing
                #region Block Elements
                var elementContainer = blockContainers[blockElementsName];

                foreach (var type in allContentTypes)
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
                elementContainer = blockContainers[blockLayoutsName];
                foreach (var type in allContentTypes)
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
                elementContainer = blockContainers[blockSettingsName];
                foreach (var type in allContentTypes)
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
        private async Task<int> CreateDataTypeContainer()
        {
            int? containerId = null;
            var dtContainerName = $"{Constants.Prefix}DataTypes";
            var container = dataTypeContainerService
                .GetAllAsync()
                .Result
                .Where(c => c.Name != null && c.Name.InvariantEquals(dtContainerName));
            if (!container.Any())
            {
                var userKey = await GetUserKey();
                if (userKey != null)
                {
                    var attempt = await dataTypeContainerService.CreateAsync(Guid.NewGuid(), dtContainerName, null, userKey.GetValueOrDefault());
                    if (attempt.Success)
                    {
                        containerId = attempt.Result?.Id;
                    }
                }
            }
            else
            {
                containerId = container.FirstOrDefault()?.Id;
            }

            if (containerId == null)
            {
                throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not create data type container.");
            }

            return containerId.GetValueOrDefault();
        }

        private async Task<Guid?> GetUserKey()
        {
            Guid? userKey = null;// identity.GetUserKey();
            if (userKey == null)
            {
                var firstAdminGroup = (await userGroupService.GetAllAsync(0, 100))
                    .Items
                    .FirstOrDefault(g => g.Alias.InvariantEquals("admin"));
                userKey = userService.GetAllInGroup(firstAdminGroup?.Id)
                    .FirstOrDefault()?
                    .Key;
            }
            return userKey;
        }

        private async Task CreateDataTypeBlockGrid(int containerId, IEnumerable<IDataType>? existingDataTypes)
        {
            var userKey = await GetUserKey()
                ?? throw new Exception("Error during uninstallation of WYSIWG Umbraco Community Extensions: Could not get user key.");

            Attempt<IDataType, DataTypeOperationStatus> attempt;
            var existingBlockGrid = existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals($"{Constants.Prefix}BlockGrid"));
            if (existingBlockGrid == null)
            {
                IDataEditor? editor = dataEditors.FirstOrDefault(e => e.Alias.Equals("Umb.PropertyEditorUi.BlockGrid"))
                    ?? dataEditors.FirstOrDefault(e => e.Alias.Equals("Umbraco.BlockGrid"))
                    ?? throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not find data editor.");

                var newDataType = new DataType(editor, serializer, containerId)
                {
                    Name = $"{Constants.Prefix}BlockGrid"
                };


                attempt = await dataTypeService.CreateAsync(newDataType, userKey);
                if (!attempt.Success)
                {
                    throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not create data type BlockGrid.");
                }
            }
            else if (_resetExisting)
            {

            }
        }
        public async Task Uninstall()
        {
            Attempt<IDataType?, DataTypeOperationStatus> dtAttempt;
            var userKey = await GetUserKey()
                ?? throw new Exception("Error during uninstallation of WYSIWG Umbraco Community Extensions: Could not get user key.");

            var existingDataTypes = await GetAllWysiwgDataTypes();
            var existingBlockGrid = existingDataTypes?.FirstOrDefault(d => d.Name != null && d.Name.Equals($"{Constants.Prefix}BlockGrid"));

            if (existingBlockGrid != null)
            {
                dtAttempt = await dataTypeService.DeleteAsync(existingBlockGrid.Key, userKey);
            }

            //Todo: delete all other data types, containers and content types
        }
    }
}
