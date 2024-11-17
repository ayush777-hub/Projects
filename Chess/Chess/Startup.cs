using Microsoft.AspNetCore.RateLimiting;
namespace Chess
{
    public static class Startup
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging();
            services.AddRouting();
        }

        public static void ConfigureAppBuilder(WebApplicationBuilder builer) 
        { 
            var app = builer.Build();
            app.UseWebSockets();
            app.UseRateLimiter();
            app.RunAsync();
        }
    }
}
