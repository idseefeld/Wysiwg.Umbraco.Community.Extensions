namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface ISetupService
    {
        public Task Install(bool resetExisting);
        public Task Uninstall();
    }
}
