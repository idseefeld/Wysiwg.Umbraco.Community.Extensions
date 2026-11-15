using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using Microsoft.Extensions.Logging;
using WysiwgUmbracoCommunityExtensions.Models;
using System.Reflection;
using WysiwgUmbracoCommunityExtensions.Attributes;

namespace WysiwgUmbracoCommunityExtensions.Services;

public class ComponentService(ILogger<ComponentService> logger, IViewComponentDescriptorCollectionProvider descriptorProvider) : IComponentService
{
    public ComponentPickerOption[] GetComponents()
    {
        var components = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(a =>
            {
                try
                {
                    return a.GetTypes();
                }
                catch (ReflectionTypeLoadException ex)
                {
                    logger.LogError(ex, "Reflection error retrieving components.");
                    return ex.Types.Where(t => t != null)!;
                }
            })
            .Where(t => t != null && t.IsClass && !t.IsAbstract && t.GetCustomAttribute<BlockElementComponentAttribute>() != null)
            .Select(d => new ComponentPickerOption
            {
                Name = d?.Name,
                Value = d?.Name
            })
            .ToArray();

        return components ?? [];
    }
}
