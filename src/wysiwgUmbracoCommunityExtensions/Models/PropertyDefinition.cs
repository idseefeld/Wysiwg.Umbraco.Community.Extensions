using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    internal class PropertyDefinition
    {
        public PropertyDefinition() { }

        public PropertyDefinition(string name, string dataTypeName, string? description = null)
        {
            Name = name;
            DataTypeName = dataTypeName;
            Description = description ?? string.Empty;
        }

        public string Name { get; set; } = string.Empty;
        public string DataTypeName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
