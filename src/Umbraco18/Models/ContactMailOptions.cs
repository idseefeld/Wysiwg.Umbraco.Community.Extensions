namespace Umbraco18.Models
{
    public class ContactMailOptions
    {
        public const string ContactMail = "ContactMail";

        public string? To { get; set; }
        public string? ToName { get; set; }

        public int? MinFormEditingInSeconds { get; set; }
    }
}
