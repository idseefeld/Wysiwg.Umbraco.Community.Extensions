using System;
using System.Collections.Generic;
using System.Text;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services.OperationStatus;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    public class FixUpgrade : TestBase
    {
        [Test]
        public async Task FixUpgrade_ThrowsException_WhenDataTypeContainerCannotBeCreated()
        {
            _contentTypeService.GetAll().Returns([]);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));

            // GetDataTypeContainer → null (no container)
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            // CreateAsync fails
            _dataTypeContainerService.CreateAsync(
                    Arg.Any<Guid>(), Arg.Any<string>(), Arg.Any<Guid?>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(
                    Attempt<EntityContainer?, EntityContainerOperationStatus>.Fail(EntityContainerOperationStatus.NotFound)));

            Assert.ThrowsAsync<Exception>(async () => await _sut.FixUpgrade(null, null));
        }
    }
}
