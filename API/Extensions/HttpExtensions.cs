using API.RequestHelpers;
using System.Text.Json;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPageinationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));

            //Header should be specifically allower for CORS becouse its Custom.
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

    }
}
