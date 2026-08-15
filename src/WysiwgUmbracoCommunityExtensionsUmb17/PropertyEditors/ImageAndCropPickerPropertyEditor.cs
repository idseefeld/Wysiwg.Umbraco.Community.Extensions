using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.ContentEditing;
using Umbraco.Cms.Core.PropertyEditors;

namespace WysiwgUmbracoCommunityExtensions.PropertyEditors
{
    [DataEditor(
            "Wysiwg.ImageAndCropPicker",
            ValueType = ValueTypes.Json,
            ValueEditorIsReusable = true)]
    public class ImageAndCropPickerPropertyEditor : DataEditor, IValueSchemaProvider
    {
        private readonly IIOHelper _ioHelper;
        public ImageAndCropPickerPropertyEditor(IDataValueEditorFactory dataValueEditorFactory, IIOHelper ioHelper) : base(dataValueEditorFactory)
        {
            _ioHelper = ioHelper;
            SupportsReadOnly = true;
        }

        public override IPropertyIndexValueFactory PropertyIndexValueFactory { get; } = new NoopPropertyIndexValueFactory();

        /// <inheritdoc />
        public JsonObject? GetValueSchema(object? configuration)
        {
            var config = configuration as MediaPicker3Configuration;

            // Build the item schema for individual media items
            var itemSchema = new JsonObject
            {
                ["type"] = "object",
                ["required"] = new JsonArray("key", "mediaKey"),
                ["properties"] = new JsonObject
                {
                    ["key"] = new JsonObject { ["type"] = "string", ["format"] = "uuid", ["pattern"] = ValueSchemaPatterns.Uuid },
                    ["mediaKey"] = new JsonObject { ["type"] = "string", ["format"] = "uuid", ["pattern"] = ValueSchemaPatterns.Uuid },
                    ["mediaTypeAlias"] = new JsonObject { ["type"] = "string" },
                    ["crops"] = BuildCropsSchema(config),
                    ["focalPoint"] = BuildFocalPointSchema(config),
                    ["selectedCropAlias"] = new JsonObject { ["type"] = new JsonArray("string", "null") },
                },
            };

            // Build the array schema
            var schema = new JsonObject
            {
                ["$schema"] = "https://json-schema.org/draft/2020-12/schema",
                ["type"] = new JsonArray("array", "null"),
                ["items"] = itemSchema,
            };

            // Add min/max items constraints from configuration
            if (config?.ValidationLimit.Min is int min && min > 0)
            {
                schema["minItems"] = min;
            }

            if (config?.ValidationLimit.Max is int max && max > 0)
            {
                schema["maxItems"] = max;
            }

            if (config?.Multiple == false)
            {
                schema["maxItems"] = 1;
            }

            return schema;
        }

        private static JsonObject BuildCropsSchema(MediaPicker3Configuration? config)
        {
            var cropItemSchema = new JsonObject
            {
                ["type"] = "object",
                ["properties"] = new JsonObject
                {
                    ["alias"] = new JsonObject { ["type"] = "string" },
                    ["width"] = new JsonObject { ["type"] = "integer" },
                    ["height"] = new JsonObject { ["type"] = "integer" },
                    ["coordinates"] = new JsonObject
                    {
                        ["oneOf"] = new JsonArray
                    {
                        new JsonObject { ["type"] = "null" },
                        new JsonObject
                        {
                            ["type"] = "object",
                            ["properties"] = new JsonObject
                            {
                                ["x1"] = new JsonObject { ["type"] = "number" },
                                ["y1"] = new JsonObject { ["type"] = "number" },
                                ["x2"] = new JsonObject { ["type"] = "number" },
                                ["y2"] = new JsonObject { ["type"] = "number" },
                            },
                        },
                    },
                    },
                },
            };

            // If crops are configured, add enum constraint for crop aliases
            if (config?.Crops is { Length: > 0 })
            {
                var cropAliases = new JsonArray();
                foreach (var crop in config.Crops)
                {
                    if (!string.IsNullOrEmpty(crop.Alias))
                    {
                        cropAliases.Add(JsonValue.Create(crop.Alias));
                    }
                }

                if (cropAliases.Count > 0)
                {
                    var aliasProperty = cropItemSchema["properties"]!["alias"]!.AsObject();
                    aliasProperty["enum"] = cropAliases;
                }
            }

            return new JsonObject
            {
                ["type"] = new JsonArray("array", "null"),
                ["items"] = cropItemSchema,
            };
        }

        private static JsonObject BuildFocalPointSchema(MediaPicker3Configuration? config)
        {
            // If focal point is disabled, always null
            if (config?.EnableLocalFocalPoint == false)
            {
                return new JsonObject { ["type"] = "null" };
            }

            return new JsonObject
            {
                ["oneOf"] = new JsonArray
            {
                new JsonObject { ["type"] = "null" },
                new JsonObject
                {
                    ["type"] = "object",
                    ["properties"] = new JsonObject
                    {
                        ["left"] = new JsonObject { ["type"] = "number", ["minimum"] = 0, ["maximum"] = 1 },
                        ["top"] = new JsonObject { ["type"] = "number", ["minimum"] = 0, ["maximum"] = 1 },
                    },
                },
            },
            };
        }

        /// <inheritdoc />
        public Type? GetValueType(object? configuration) => typeof(LinkDisplay[]);

        protected override IConfigurationEditor CreateConfigurationEditor()
        {
            return new ImageAndCropPickerConfigurationEditor(_ioHelper);
        }

        protected override IDataValueEditor CreateValueEditor()
        {
            var rVal = DataValueEditorFactory.Create<ImageAndCropPickerDataValueEditor>(Attribute!);

            return rVal;
        }
    }

}
