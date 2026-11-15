using Our.Umbraco.DictionaryLocalizer.Models;
using System.ComponentModel.DataAnnotations;

namespace Umbraco19.Models
{
    public class ContactFormModel : DictionaryDataAnnotationBaseModel
    {
        [Required(ErrorMessage = "#nameRequired")]
        [Display(Name = "Name")]
        public string FirstAndLastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "#emailRequired")]
        [EmailAddress(ErrorMessage = "#emailInvalid")]
        [Display(Name = "E-Mail")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Betreff")]
        [Required(ErrorMessage = "#subjectRequired")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Nachricht")]
        [Required(ErrorMessage = "#messageRequired")]
        public string Message { get; set; } = string.Empty;

        public int? EditingTime { get; set; }
        public string? HostInfo { get; set; }
        public bool DataConsent { get; set; }
        [Required(ErrorMessage = "#dataConsentRequired")]
        public string? DataConsentText { get; set; }
    }
}
