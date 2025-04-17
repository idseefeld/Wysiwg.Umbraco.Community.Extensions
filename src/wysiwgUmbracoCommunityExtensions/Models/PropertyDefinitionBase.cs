using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Models;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    internal class PropertyDefinitionBase
    {
        public PropertyDefinitionBase() { }

        public PropertyDefinitionBase(string name, string dataTypeName, string? description = null, ContentVariation variations = ContentVariation.Nothing)
        {
            Name = name;
            DataTypeName = dataTypeName;
            Description = description ?? string.Empty;
            Variations = variations;
        }

        public string Name { get; set; } = string.Empty;
        public string DataTypeName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ContentVariation Variations { get; set; } = ContentVariation.Nothing;
    }
}
