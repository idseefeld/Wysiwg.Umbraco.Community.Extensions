using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Umbraco.Cms.Core.PropertyEditors;
using Umbraco.Cms.Core.Models.Validation;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ImageAndCropPickerValueValidator : IValueValidator
    {
        public IEnumerable<ValidationResult> Validate(object? value, string? valueType, object? dataTypeConfiguration, PropertyValidationContext validationContext)
        {
            return [];

        }
    }
}
