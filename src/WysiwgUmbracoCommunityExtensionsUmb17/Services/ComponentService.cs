using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;
using Microsoft.Extensions.Logging;
using WysiwgUmbracoCommunityExtensions.Models;

namespace WysiwgUmbracoCommunityExtensions.Services;

public class ComponentService(ILogger<ComponentService> logger) : IComponentService
{
    public ComponentPickerOption[] GetComponents()
    {
        try
        {
            var components = GetViewComponents();

            return components;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving components.");
        }

        return Array.Empty<ComponentPickerOption>();
    }

    private ComponentPickerOption[] GetViewComponents()
    {
        return [
            new ComponentPickerOption
            {
                Name = "Sample Component",
                Value = "SampleComponent"
            },
            new ComponentPickerOption
            {
                Name = "Contact Form",
                Value = "ContactForm"
            }
            ];
    }
}
