using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Nodes;
using Microsoft.IdentityModel.Logging;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    [DataEditor(
            "Wysiwg.ComponentPicker",
            ValueEditorIsReusable = true)]
    public class ComponentPickerPropertyEditor : DataEditor, IValueSchemaProvider
    {
        private readonly IIOHelper _ioHelper;

        public ComponentPickerPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory)
        {
            _ioHelper = ioHelper;
            SupportsReadOnly = true;
        }

        public Type? GetValueType(object? configuration) => typeof(IEnumerable<string>);

        public JsonObject? GetValueSchema(object? configuration) => new()
        {
            ["$schema"] = "https://json-schema.org/draft/2020-12/schema",
            ["type"] = new JsonArray("string", "null"),
        };

        protected override IDataValueEditor CreateValueEditor() => DataValueEditorFactory.Create<ComponentPickerDataValueEditor>(Attribute!);

        protected override IConfigurationEditor CreateConfigurationEditor() => new ConfigurationEditor();
    }
}
