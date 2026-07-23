using Umbraco18.Models;

namespace Umbraco18.Services
{
    public interface IMailService
    {
        public Task HandleContactDataAsync(ContactFormModel formData);
    }   
}
