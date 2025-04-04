using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PropertyEditors.ValueConverters;

namespace WysiwgUmbracoCommunityExtensions.Models
{
    public class ImageAndCropPickerModel //: MediaWithCropsDto //MediaWithCropsDto is internal!
    {
        public Guid Key { get; set; }

        public Guid MediaKey { get; set; }

        public string MediaTypeAlias { get; set; } = string.Empty;

        public IEnumerable<ImageCropperValue.ImageCropperCrop>? Crops { get; set; }

        public ImageCropperValue.ImageCropperFocalPoint? FocalPoint { get; set; }

        public string? SelectedCropAlias { get; init; }
    }
}
