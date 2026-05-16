using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using Umbraco.Cms.Tests.Integration.Implementations;
using Umbraco.Cms.Tests.Integration.Testing;

/// <summary>
///     Global setup and teardown for the WysiwgUmbracoCommunityExtensions integration test assembly.
/// </summary>
/// <remarks>
///     This class has NO NAMESPACE so it applies to the whole assembly.
/// </remarks>
[SetUpFixture]
public class WysiwgGlobalSetupTeardown
{
    private Stopwatch _stopwatch = null!;

    public static IConfiguration TestConfiguration { get; private set; } = null!;

    [OneTimeSetUp]
    public void SetUp()
    {
        var builder = new ConfigurationBuilder();
        builder.AddJsonFile("appsettings.Tests.json");
        builder.AddJsonFile("appsettings.Tests.Local.json", optional: true);
        builder.AddEnvironmentVariables();
        TestConfiguration = builder.Build();

        var testHelper = new TestHelper();
        var databaseType =
            TestConfiguration.GetValue<TestDatabaseSettings.TestDatabaseType>("Tests:Database:DatabaseType");
        var version = testHelper.GetUmbracoVersion().SemanticVersion;

        TestContext.Progress.WriteLine(
            "******************************************************************************");
        TestContext.Progress.WriteLine("* WysiwgUmbracoCommunityExtensions - Integration Tests");
        TestContext.Progress.WriteLine("*");
        TestContext.Progress.WriteLine($"* DatabaseType     : {databaseType}");
        TestContext.Progress.WriteLine($"* UmbracoVersion   : {version.ToString().Split('+').First()}");
        TestContext.Progress.WriteLine($"* WorkingDirectory : {testHelper.WorkingDirectory}");
        TestContext.Progress.WriteLine(
            "******************************************************************************");

        _stopwatch = Stopwatch.StartNew();
    }

    [OneTimeTearDown]
    public void TearDown()
    {
        BaseTestDatabase.Instance?.TearDown();
        Console.WriteLine("TOTAL TESTS DURATION: {0}", _stopwatch.Elapsed);
    }
}
