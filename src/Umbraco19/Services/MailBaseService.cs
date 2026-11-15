using System.Text;
using Umbraco19.Models;

namespace Umbraco19.Services
{
    public abstract class MailBaseService
    {
        protected static string BuildContactBody(ContactFormModel formData)
        {
            var body = new StringBuilder("Contact");
            body.AppendLine("");
            body.AppendLine($"{formData.HostInfo} edited in {formData.EditingTime} seconds.");
            body.AppendLine("");
            body.AppendLine("Subject:");
            body.AppendLine(formData.Subject);
            body.AppendLine("");
            body.AppendLine("Name:");
            body.AppendLine(formData.FirstAndLastName);
            body.AppendLine("");
            body.AppendLine("Email:");
            body.AppendLine(formData.Email);
            body.AppendLine("");
            body.AppendLine("Message:");
            body.AppendLine(formData.Message);

            body.AppendLine("");
            body.AppendLine("Consent:");
            body.AppendLine(formData.DataConsentText);
            return body.ToString();
        }
    }
}
