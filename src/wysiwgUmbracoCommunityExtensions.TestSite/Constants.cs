namespace WysiwgUmbracoCommunityExtensions.TestSite
{
    public static class Constants
    {
        public static bool Debug
        {
            get
            {
#if DEBUG
                return true;

#else
                return false;
#endif
            }
        }
    }
}
