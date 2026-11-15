using Our.Umbraco.DictionaryLocalizer.Models;
using System.ComponentModel.DataAnnotations;

namespace Umbraco19.Models
{
    public class ContactFormModel : DictionaryDataAnnotationBaseModel
    {
        [Required(ErrorMessage = "#requiredErrorMessage")]
        [Display(Name = "Name")]
        public string FirstAndLastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "#requiredErrorMessage")]
        [EmailAddress(ErrorMessage = "#InvalidErrorMessage.email")]
        [Display(Name = "#emailLabel")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "#subjectLabel")]
        [Required(ErrorMessage = "#requiredErrorMessage")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "#messageLabel")]
        [Required(ErrorMessage = "#requiredErrorMessage")]
        public string Message { get; set; } = string.Empty;

        public int? EditingTime { get; set; }
        public string? HostInfo { get; set; }
        public bool DataConsent { get; set; }
        [Required(ErrorMessage = "#consentRequiredErrorMessage")]
        public string? DataConsentText { get; set; }
    }
}
