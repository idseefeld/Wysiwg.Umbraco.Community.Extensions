using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services.OperationStatus;
using WysiwgUmbracoCommunityExtensions.Extensions;
using static Umbraco.Cms.Core.PropertyEditors.ColorPickerConfiguration;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    public class InstallTests : TestBase
    {
        [Test]
        public async Task Install_ThrowsException_WhenDataTypeContainerCannotBeCreated()
        {
            // GetVersionStatus -> Install
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            // CreateDataTypeContainer -> failure
            _dataTypeContainerService.CreateAsync(
                    Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<Guid?>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(Attempt<EntityContainer?, EntityContainerOperationStatus>.Fail(EntityContainerOperationStatus.NotFound)));

            Assert.ThrowsAsync<Exception>(async () => await _sut.Install());
        }

        [Test]
        public async Task Validate_ColorPickerSetup()
        {
            var jsonArray = @"
[
    {""value"":""d60000"",""label"":""""},
    {""value"":""000"",""label"":""""}
]".GetJsonArrayFromString();

            List<ColorPickerItem> defaultItems = new List<ColorPickerItem>()
            {
                new() { Value = "d60000", Label = "" },
                new() { Value = "000", Label = "" },
            };
            string itemsValueString = JsonSerializer.Serialize(defaultItems).ToLowerInvariant();
            var jsonArray2 = itemsValueString.GetJsonArrayFromString();

            Assert.That(jsonArray.ToJsonString(), Is.EqualTo(jsonArray2.ToJsonString()));
        }

        [Test]
        public async Task Install_DoesNothing_WhenAlreadyUpToDate()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            // Should complete without throwing
            Assert.DoesNotThrowAsync(async () => await _sut.Install());
        }
    }
}
