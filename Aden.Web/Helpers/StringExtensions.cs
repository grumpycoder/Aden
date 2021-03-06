using System.Text;

namespace Aden.Web.Helpers
{
    public static class StringExtensions
    {
        public static string Repeat(this string instr, int n)
        {
            if (n <= 0)
            {
                return null;
            }

            if (string.IsNullOrEmpty(instr) || n == 1)
            {
                return instr;
            }

            return new StringBuilder(instr.Length * n)
                .Insert(0, instr, n)
                .ToString();
        }
    }
}
