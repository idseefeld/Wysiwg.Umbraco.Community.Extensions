# This file is used to document the steps to create the initial migration for the BlogContext in the EFCoreBlogFeatures project.

dotnet ef migrations add initialCreateBolgComments -s ../WysiwgUmbracoCommunityExtensions.TestSite/ --context BlogContext

# remove with

dotnet ef migrations remove -s ../WysiwgUmbracoCommunityExtensions.TestSite/ --context BlogContext
