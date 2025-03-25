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
using Umbraco.Cms.Core.Services;
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
        IUserGroupService userGroupService
        ) : ISetupService
    {
        public async Task Install()
        {
            var containerId = await CreateDataTypeContainer();
            if (containerId < 0)
            {
                throw new Exception("Error during installation of WYSIWG Umbraco Community Extensions: Could not create data type container.");
            }

            await CreateDataTypesForBlockElements(containerId);


            CreateBlockElements();

            await CreateDataTypeBlockGrid();

            logger.LogInformation("Successfully installed of WYSIWG Umbraco Community Extensions.");

        }

        private async Task CreateDataTypesForBlockElements(int containerId)
        {
        }
        private void CreateBlockElements()
        {
            Attempt<OperationResult<OperationResultType, EntityContainer>?> attempt;
            var containerName = "Wysiwg65";
            var level = 1;
            EntityContainer? rootContainer = contentTypeService.GetContainers(containerName, level).FirstOrDefault();
            if (rootContainer == null)
            {
                attempt = contentTypeService.CreateContainer(-1, Guid.NewGuid(), containerName);
                if (attempt.Success)
                {
                    rootContainer = attempt.Result?.Entity;
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
                attempt = contentTypeService.CreateContainer(rootContainer.Id, Guid.NewGuid(), name);
                if (attempt.Success)
                {
                    container = attempt.Result?.Entity;
                }
                if (container == null)
                {
                    throw new Exception($"Error during installation of WYSIWG Umbraco Community Extensions: Could not create {name} folder.");
                }
            }

            var allContentTypes = contentTypeService.GetAll()
                .Where(t => t.Alias.StartsWith(Constants.Prefix));

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
                    case "Headline Settings":
                        //properties: color, size, margin
                        break;
                    case "Paragraph Settings":
                        //properties: color
                        break;
                    case "Row Settings":
                        //properties: backgroundImage, backgroundColor
                        break;
                    default:
                        break;
                }
            }
            #endregion
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
            return containerId ?? -1;
        }

        private async Task CreateDataTypeBlockGrid()
        {
            var allDtTypes = (await dataTypeService
                .GetAllAsync())
                .Where(d => d.Name != null && d.Name.StartsWith(Constants.Prefix));
        }
        public async Task Uninstall()
        {
            // Uninstall logic here
        }
    }
}
