using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;
using Umbraco.Cms.Core.Models.Validation;
using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    public class ComponentPickerDataValueValidator : IValueValidator
    {
        public IEnumerable<ValidationResult> Validate(object? value, string? valueType, object? dataTypeConfiguration, PropertyValidationContext validationContext)
        {
            return [];
        }
    }
}
