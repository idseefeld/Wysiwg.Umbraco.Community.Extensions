using Microsoft.AspNetCore.Http;

namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface ISetupService
    {
        public Task Install(bool resetExisting);
        public Task FixUpgrade(bool? culture, bool? segment);
        public Task Uninstall();
        public Task<VersionStatus> GetVersionStatus();
        public string GetVariations();
        public Task<int> GetVersionStatusCode();
    }
}
