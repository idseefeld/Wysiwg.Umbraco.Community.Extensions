namespace WysiwgUmbracoCommunityExtensions.TestSite.Models
{
    public class Row
    {
        public string? BackgroundImageSrc { get; set; }
        public PickerColor? BackgroundColor { get; set; }

    }
    public class PickerColor
    {
        public string? Color { get; set; }
        public string? Label { get; set; }
    }
}
