using System.ComponentModel.DataAnnotations;

namespace Umbraco18.Models
{
    public class ContactFormModel
    {
        [Required(ErrorMessage = "Bitte geben Sie Ihren Namen ein.")]
        [Display(Name = "Name")]
        public string FirstAndLastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Bitte geben Sie Ihre E-Mail-Adresse ein.")]
        [EmailAddress(ErrorMessage = "Bitte geben Sie eine gültige E-Mail-Adresse ein.")]
        [Display(Name = "E-Mail")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Betreff")]
        [Required(ErrorMessage = "Bitte geben Sie einen Betreff ein.")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Nachricht")]
        [Required(ErrorMessage = "Bitte geben Sie eine Nachricht ein.")]
        public string Message { get; set; } = string.Empty;

        public int? EditingTime { get; set; }
        public string? HostInfo { get; set; }
        public bool DataConsent { get; set; }
        [Required(ErrorMessage = "Bitte stimmen Sie der Datenverarbeitung zu.")]
        public string? DataConsentText { get; set; }
    }
}
