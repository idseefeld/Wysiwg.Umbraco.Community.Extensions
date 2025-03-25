namespace WysiwgUmbracoCommunityExtensions.Services
{
    public interface ISetupService
    {
        public Task Install();
        public Task Uninstall();
    }
}
