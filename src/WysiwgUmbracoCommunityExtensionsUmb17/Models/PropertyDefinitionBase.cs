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

        public PropertyDefinitionBase(string name, string dataTypeName,  string? description = null, ContentVariation variations = ContentVariation.Nothing, bool isMandatory = false, string? alias = null)
        {
            Name = name;
            Alias = alias;
            DataTypeName = dataTypeName;
            Description = description ?? string.Empty;
            Variations = variations;
            IsMandatory = isMandatory;
        }

        public string Name { get; set; } = string.Empty;
        public string? Alias { get; set; }
        public string DataTypeName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsMandatory { get; set; } = false;

        public ContentVariation Variations { get; set; } = ContentVariation.Nothing;
    }
}
