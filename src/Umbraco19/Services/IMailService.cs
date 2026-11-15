using Umbraco19.Models;

namespace Umbraco19.Services
{
    public interface IMailService
    {
        public Task HandleContactDataAsync(ContactFormModel formData);
    }   
}
