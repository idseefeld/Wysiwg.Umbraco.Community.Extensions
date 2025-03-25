using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public class InstallService(
        //ILogger logger,
        IContentTypeService contentTypeService,
        IDataTypeService dataTypeService,
        IDataTypeContainerService dataTypeContainerService) : IInstallService
    {
        public void Install()
        {
            const string prefix = "wysiwg65_";
            #region create document types
            //var allContentTypeContainers = contentTypeService.GetContainers();
            var allContentTypes = contentTypeService.GetAll()
                .Where(t => t.Alias.StartsWith(prefix));
            foreach (var type in allContentTypes)
            {
                switch(type.Alias.Replace(prefix, string.Empty)){
                    case "headline":
                        break;
                    case "paragraph":
                        break;
                    case "pictureWithCrop":
                        break;
                    default:
                        break;
                }
            }
            #endregion

            #region create data types
            var allDtContainers = dataTypeContainerService.GetAllAsync().Result;

            var allDtTypes = dataTypeService.GetAllAsync().Result;
            #endregion
        }

        public void Uninstall()
        {
            // Uninstall logic here
        }

        private void Update() { }
    }
}
