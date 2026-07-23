using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Umbraco18.TagHelpers
{
    public class ForPlaceholderTagHelper : TagHelper
    {
        public override void Init(TagHelperContext context)
        {
            base.Init(context);
        }
        public override Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            return base.ProcessAsync(context, output);
        }
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            base.Process(context, output);
        }

        public override int Order => base.Order;
    }
}
