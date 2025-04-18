namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface ISetupService
    {
        public Task Install(bool resetExisting);
        public Task Uninstall();
        public Task<VersionStatus> GetVersionStatus();
        public Task<int> GetVersionStatusCode();
    }
}
