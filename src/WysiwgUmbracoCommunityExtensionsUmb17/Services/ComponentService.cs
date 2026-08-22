using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.Extensions.Logging;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.Services;

public class ComponentService(ILogger<ComponentService> logger, IViewComponentDescriptorCollectionProvider descriptorProvider) : IComponentService
{
    public ComponentPickerOption[] GetComponents()
    {
        try
        {
            var components = descriptorProvider.ViewComponents.Items
                .Where(d => d.ShortName.StartsWith("BlockElement"))
                .Select(d => new ComponentPickerOption
                {
                    Name = d.ShortName, //[12..],
                    Value = d.ShortName
                })
                .ToArray();

            return components;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving components.");
        }

        return Array.Empty<ComponentPickerOption>();
    }
}
