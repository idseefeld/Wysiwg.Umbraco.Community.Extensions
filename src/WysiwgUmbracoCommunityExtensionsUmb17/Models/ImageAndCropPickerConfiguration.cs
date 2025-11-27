using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.PropertyEditors;
using static Umbraco.Cms.Core.PropertyEditors.MediaPicker3Configuration;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ImageAndCropPickerConfiguration : IIgnoreUserStartNodesConfig    
    {
        public class CropConfigurationExtended : CropConfiguration
        {
            [ConfigurationField("label")]
            public string? Label { get; set; }

            [ConfigurationField("defaultCrop")]
            public bool DefaultCrop { get; internal set; }
        }

        [ConfigurationField("filter")]
        public string? Filter { get; set; }

        [ConfigurationField("multiple")]
        public bool Multiple { get; } = false;

        [ConfigurationField("validationLimit")]
        public NumberRange ValidationLimit { get; } = new NumberRange() { Min = 0, Max = 1 };

        [ConfigurationField("startNodeId")]
        public Guid? StartNodeId { get; set; }

        [ConfigurationField("enableLocalFocalPoint")]
        public bool EnableLocalFocalPoint { get; set; }

        [ConfigurationField("crops")]
        public CropConfigurationExtended[]? Crops { get; set; }

        [ConfigurationField(Umbraco.Cms.Core.Constants.DataTypes.ReservedPreValueKeys.IgnoreUserStartNodes)]
        public bool IgnoreUserStartNodes { get; set; }

        //[ConfigurationField("defaultCropAlias")]
        //public string? DefaultCropAlias { get; set; }
    }
}
