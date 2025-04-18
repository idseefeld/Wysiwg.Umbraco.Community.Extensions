using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Models;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    internal class PropertyDefinition : PropertyDefinitionBase
    {
        public PropertyDefinition() { }

        public PropertyDefinition(string name, string dataTypeName, int sortOrder, string? description = null, ContentVariation variations = ContentVariation.Nothing)
            : base(name, dataTypeName, description, variations)
        {
            SortOrder = sortOrder;
        }


        public int SortOrder { get; set; } = 1;
    }
}
