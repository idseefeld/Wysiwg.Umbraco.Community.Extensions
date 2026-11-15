using System.Security.Cryptography;
using System.Text;

namespace WysiwgUmbracoCommunityExtensions.Extensions
{

    public static class StringExtensions
    {
        public static string ToMd5(this string input)
        {
            var inputBytes = Encoding.ASCII.GetBytes(input);
            var hashBytes = MD5.HashData(inputBytes);
            var sb = new StringBuilder();
            foreach (var t in hashBytes)
            {
                _ = sb.Append(t.ToString("X2"));
            }
            return sb.ToString();
        }
    }
}
