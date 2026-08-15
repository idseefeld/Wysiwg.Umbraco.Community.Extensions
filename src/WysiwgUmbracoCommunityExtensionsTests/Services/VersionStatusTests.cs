using System;
using System.Collections.Generic;
using System.Text;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core.Models;
using WysiwgUmbracoCommunityExtensions.Services;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    public class VersionStatusTests: TestBase
    {
        [Test]
        public async Task GetVersionStatus_ReturnsInstall_WhenDataTypeContainerDoesNotExist()
        {
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Install));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRequiredDataTypesAreMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // Return empty data types so required ones are missing
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>([]));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsIntValue_MatchingVersionStatus()
        {
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([]));

            var code = await _sut.GetVersionStatusCode();

            Assert.That(code, Is.EqualTo((int)VersionStatus.Install));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRteDataTypeIsAbsent()
        {
            // Container exists
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // RTE data type not present → IsRteUpdateRequired returns true
            var dataTypes = CreateRequiredDataTypes(includeRte: false);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRotationDataTypeIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            // All required data types with correct RTE config, but no Rotation
            var dataTypes = CreateRequiredDataTypes(includeRotation: false);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRequiredContentTypesAreMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            // No content types → required content types check fails
            _contentTypeService.GetAll().Returns([]);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenRowSettingsMinHeightPropertyIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            // rowSettings without minHeight property
            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: false, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpdate_WhenParagraphSettingsMinHeightPropertyIsMissing()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: false);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.Update));
        }

        [Test]
        public async Task GetVersionStatus_ReturnsUpToDate_WhenAllRequirementsAreMet()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var result = await _sut.GetVersionStatus();

            Assert.That(result, Is.EqualTo(VersionStatus.UpToDate));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsZero_WhenStatusIsUnknown()
        {
            Assert.That((int)VersionStatus.Unknown, Is.EqualTo(0));
        }

        [Test]
        public async Task GetVersionStatusCode_ReturnsCorrectCode_WhenStatusIsUpToDate()
        {
            var container = CreateEntityContainer();
            _dataTypeContainerService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<EntityContainer>>([container]));

            var dataTypes = CreateRequiredDataTypes(includeRotation: true);
            _dataTypeService.GetAllAsync()
                .Returns(Task.FromResult<IEnumerable<IDataType>>(dataTypes));

            var contentTypes = CreateRequiredContentTypes(rowSettingsHasMinHeight: true, paragraphSettingsHasMinHeight: true);
            _contentTypeService.GetAll().Returns(contentTypes);

            var code = await _sut.GetVersionStatusCode();

            Assert.That(code, Is.EqualTo((int)VersionStatus.UpToDate));
        }
    }
}
