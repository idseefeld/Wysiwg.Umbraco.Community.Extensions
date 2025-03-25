using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Cms.Core.Models;

namespace WysiwgUmbracoCommunityExtensions.ViewModels
{
    public class Wysiwg65_pictureWithCrop
    {
        public MediaWithCrops? MediaItem { get; set; }
        public string? AlternativeText { get; set; }
        public string? FigCaption { get; set; }
        public PickerColor? CaptionColor { get; set; }
        public string? CropAlias { get; set; }
    }
}
