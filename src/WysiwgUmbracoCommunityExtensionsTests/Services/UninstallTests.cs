using System;
using System.Collections.Generic;
using System.Text;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services.OperationStatus;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    public class UninstallTests : TestBase
    {
        [Test]
        public async Task Uninstall_CompletesWithoutError_WhenNothingIsInstalled()
        {
            _contentTypeService.GetAll().Returns([]);
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));
            _partialViewService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IPartialView>>([]));

            Assert.DoesNotThrowAsync(async () => await _sut.Uninstall());
        }

        [Test]
        public async Task Uninstall_ThrowsException_WhenContentTypeDeletionFails()
        {
            var contentType = Substitute.For<IContentType>();
            contentType.Alias.Returns("wysiwg65_headline");
            contentType.Key.Returns(Guid.NewGuid());
            contentType.Name.Returns("Headline");

            _contentTypeService.GetAll().Returns([contentType]);
            _contentTypeService.DeleteAsync(Arg.Any<Guid>(), Arg.Any<Guid>())
                .Returns(Task.FromResult(ContentTypeOperationStatus.NotFound));

            Assert.ThrowsAsync<Exception>(async () => await _sut.Uninstall());
        }
    }
}
