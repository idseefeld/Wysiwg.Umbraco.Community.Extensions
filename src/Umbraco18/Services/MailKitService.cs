using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MimeKit;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco18.Models;

namespace Umbraco18.Services
{
    public class MailKitService : MailBaseService, IMailService
    {
        private readonly IOptionsMonitor<GlobalSettings> _globalSettings;
        private readonly ContactMailOptions _mailOptions;
        private readonly ILogger<MailKitService> _logger;

        public MailKitService(IOptionsMonitor<GlobalSettings> globalSettings, IOptions<ContactMailOptions> mailOptions, ILogger<MailKitService> logger)
        {
            _globalSettings = globalSettings;
            _mailOptions = mailOptions.Value;
            _logger = logger;
        }

        public async Task HandleContactDataAsync(ContactFormModel formData)
        {
            if (string.IsNullOrWhiteSpace(_mailOptions.To))
            {
                throw new Exception("No recipient configured. Check appSettings ContactMail:To");
            }
            var smtpSettings = _globalSettings.CurrentValue.Smtp;
            if (smtpSettings == null || string.IsNullOrEmpty(smtpSettings.Host))
            {
                throw new Exception("No smtp configured. Check appSettings Umbraco:CMS:Global:Smtp");
            }

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(null, smtpSettings.From ?? "no-reply@example.com"));
            message.To.Add(new MailboxAddress(_mailOptions.ToName, _mailOptions.To));
            message.Subject = formData.Subject;
            message.Body = new TextPart("plain")
            {
                Text = $"{BuildContactBody(formData)}"
            };

            //var message = new EmailMessage(smtpSettings.From ?? "no-reply@example.com", _mailOptions.To, formData.Subject, $"{BuildContactBody(formData)}", false);

            // var expires = new TimeSpan(0, 5, 0); // Set the expiration time to 5 minutes
            // await _emailSenderClient.SendAsync(message, expires);
            using var client = new SmtpClient();
            SendMessage(smtpSettings, message, client);
        }

        private void SendMessage(SmtpSettings smtpSettings, MimeMessage message, SmtpClient client)
        {
            if (smtpSettings.Port > 0)
            {
                var useSsl = smtpSettings.SecureSocketOptions.ToString() == SecureSocketOptions.SslOnConnect.ToString();
                try
                {
                    client.Connect(smtpSettings.Host ?? "localhost", smtpSettings.Port, useSsl);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to connect to SMTP server at {Host}:{Port} with SSL: {UseSsl}", smtpSettings.Host, smtpSettings.Port, useSsl);
                    return;
                }
            }
            else
            {
                client.Connect(smtpSettings.Host ?? "localhost");
            }

            if (!string.IsNullOrWhiteSpace(smtpSettings.Username) && !string.IsNullOrWhiteSpace(smtpSettings.Password))
            {
                client.Authenticate(smtpSettings.Username, smtpSettings.Password);
            }

            client.Send(message);
            client.Disconnect(true);
        }
    }
}
