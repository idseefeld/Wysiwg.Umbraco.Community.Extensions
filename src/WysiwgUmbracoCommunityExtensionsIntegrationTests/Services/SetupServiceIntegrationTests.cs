using NUnit.Framework;
using Umbraco.Cms.Tests.Common.Testing;
using WysiwgUmbracoCommunityExtensions;
using WysiwgUmbracoCommunityExtensions.Services;
using WysiwgUmbracoCommunityExtensionsIntegrationTests.Testing;

namespace WysiwgUmbracoCommunityExtensionsIntegrationTests.Services;

/// <summary>
///     Integration tests for <see cref="SetupService" /> running inside a real Umbraco environment
///     backed by an in-process SQLite database.
/// </summary>
[TestFixture]
public class SetupServiceIntegrationTests : WysiwgIntegrationTestBase
{
    // ── helpers ────────────────────────────────────────────────────────────────

    private static readonly string Prefix = Constants.Prefix;                       // "wysiwg65_"
    private static readonly string ContainerName = $"{Prefix.ToFirstUpper()}DataTypes"; // "Wysiwg65_DataTypes"

    private static readonly string[] RequiredDataTypeNames =
    [
        $"{Prefix}CallToActionLabel",
        $"{Prefix}CallToActionOnClick",
        $"{Prefix}HeadlineSizes",
        $"{Prefix}LimitedHeadline",
        $"{Prefix}ParagaphRTE",
        $"{Prefix}CustomerColors",
        $"{Prefix}ImageAndCropPicker",
        $"{Prefix}Rotation",
    ];

    private static readonly string[] RequiredContentTypeAliases =
    [
        $"{Prefix}callToAction",
        $"{Prefix}headline",
        $"{Prefix}paragraph",
        $"{Prefix}croppedPicture",
        $"{Prefix}layout1",
        $"{Prefix}layout2",
        $"{Prefix}layout3",
        $"{Prefix}layout4",
        $"{Prefix}callToActionSettings",
        $"{Prefix}headlineSettings",
        $"{Prefix}paragraphSettings",
        $"{Prefix}rowSettings",
    ];

    private static readonly string BlockGridName = $"{Prefix}BlockGrid";

    // ── tests ──────────────────────────────────────────────────────────────────

    [Test]
    public async Task GetVersionStatus_ReturnsInstall_OnFreshDatabase()
    {
        var status = await SetupService.GetVersionStatus();

        Assert.That(status, Is.EqualTo(VersionStatus.Install));
    }

    [Test]
    public async Task Install_CreatesDataTypeContainer()
    {
        await SetupService.Install();

        var containers = await DataTypeContainerService.GetAllAsync();
        var container = containers.FirstOrDefault(c =>
            c.Name != null && c.Name.Equals(ContainerName, StringComparison.OrdinalIgnoreCase));

        Assert.That(container, Is.Not.Null, $"Expected data type container '{ContainerName}' to exist after Install().");
    }

    [Test]
    public async Task Install_CreatesAllRequiredDataTypes()
    {
        await SetupService.Install();

        var allDataTypes = await DataTypeService.GetAllAsync();
        var names = allDataTypes.Select(dt => dt.Name).ToHashSet();

        Assert.Multiple(() =>
        {
            foreach (var expected in RequiredDataTypeNames)
            {
                Assert.That(names, Does.Contain(expected), $"Expected data type '{expected}' to exist after Install().");
            }
        });
    }

    [Test]
    public async Task Install_CreatesBlockGridDataType()
    {
        await SetupService.Install();

        var blockGrid = await DataTypeService.GetAsync(BlockGridName);

        Assert.That(blockGrid, Is.Not.Null, $"Expected Block Grid data type '{BlockGridName}' to exist after Install().");
    }

    [Test]
    public async Task Install_CreatesAllRequiredContentTypes()
    {
        await SetupService.Install();

        var allAliases = ContentTypeService.GetAll().Select(ct => ct.Alias).ToHashSet();

        Assert.Multiple(() =>
        {
            foreach (var expected in RequiredContentTypeAliases)
            {
                Assert.That(allAliases, Does.Contain(expected), $"Expected content type '{expected}' to exist after Install().");
            }
        });
    }

    [Test]
    public async Task GetVersionStatus_ReturnsUpToDate_AfterInstall()
    {
        await SetupService.Install();

        var status = await SetupService.GetVersionStatus();

        Assert.That(status, Is.EqualTo(VersionStatus.UpToDate));
    }

    [Test]
    public async Task Install_IsIdempotent()
    {
        await SetupService.Install();
        Assert.DoesNotThrowAsync(async () => await SetupService.Install());

        var status = await SetupService.GetVersionStatus();
        Assert.That(status, Is.EqualTo(VersionStatus.UpToDate));
    }

    [Test]
    public async Task Uninstall_RemovesDataTypeContainer()
    {
        await SetupService.Install();

        await SetupService.Uninstall();

        var containers = await DataTypeContainerService.GetAllAsync();
        var container = containers.FirstOrDefault(c =>
            c.Name != null && c.Name.Equals(ContainerName, StringComparison.OrdinalIgnoreCase));

        Assert.That(container, Is.Null, $"Expected data type container '{ContainerName}' to be removed after Uninstall().");
    }

    [Test]
    public async Task Uninstall_RemovesAllPackageDataTypes()
    {
        await SetupService.Install();

        await SetupService.Uninstall();

        var allDataTypes = await DataTypeService.GetAllAsync();
        var packageDataTypes = allDataTypes.Where(dt => dt.Name != null && dt.Name.StartsWith(Prefix)).ToList();

        Assert.That(packageDataTypes, Is.Empty, "Expected all package data types to be removed after Uninstall().");
    }

    [Test]
    public async Task GetVersionStatus_ReturnsInstall_AfterUninstall()
    {
        await SetupService.Install();
        await SetupService.Uninstall();

        var status = await SetupService.GetVersionStatus();

        Assert.That(status, Is.EqualTo(VersionStatus.Install));
    }

    [Test]
    public async Task GetVersionStatusCode_Returns200_WhenUpToDate()
    {
        await SetupService.Install();

        var code = await SetupService.GetVersionStatusCode();

        Assert.That(code, Is.EqualTo((int)VersionStatus.UpToDate));
    }
}
