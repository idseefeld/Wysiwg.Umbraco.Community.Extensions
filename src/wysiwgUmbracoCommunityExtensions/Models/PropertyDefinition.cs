using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    internal class PropertyDefinition : PropertyDefinitionBase
    {
        public PropertyDefinition() { }

        public PropertyDefinition(string name, string dataTypeName, int sortOrder, string? description = null)
            : base(name, dataTypeName, description)
        {
            SortOrder = sortOrder;
        }


        public int SortOrder { get; set; } = 1;
    }
}
