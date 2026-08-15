using System;
using System.Collections.Generic;
using System.Text;
using NSubstitute;
using NUnit.Framework;
using Umbraco.Cms.Core.Models;

namespace WysiwgUmbracoCommunityExtensionsTests.Services
{
    public class VariationsTests : TestBase
    {
        [Test]
        public void GetVariations_ReturnsEmptyString_WhenNoContentTypes()
        {
            _contentTypeService.GetAll().Returns([]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.Empty);
        }

        [Test]
        public void GetVariations_ReturnsCulture_WhenHeadlineVariesByCulture()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Culture);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("culture"));
        }

        [Test]
        public void GetVariations_ReturnsCultureSegment_WhenHeadlineVariesByCultureAndSegment()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.CultureAndSegment);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("culture segment"));
        }

        [Test]
        public void GetVariations_ReturnsSegment_WhenHeadlineVariesBySegment()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Segment);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.EqualTo("segment"));
        }

        [Test]
        public void GetVariations_ReturnsEmpty_WhenHeadlineHasNoVariation()
        {
            var headlineType = Substitute.For<IContentType>();
            headlineType.Alias.Returns("wysiwg65_headline");
            headlineType.Variations.Returns(ContentVariation.Nothing);

            _contentTypeService.GetAll()
                .Returns([headlineType]);

            var result = _sut.GetVariations();

            Assert.That(result, Is.Empty);
        }
    }
}
