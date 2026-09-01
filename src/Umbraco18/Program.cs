
using Umbraco18.Models;
using Umbraco18.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

var config = builder.Configuration;

builder.Services.Configure<ContactMailOptions>(config.GetSection(ContactMailOptions.ContactMail));

var contactMailConfig = config.GetSection(ContactMailOptions.ContactMail).Get<ContactMailOptions>();
builder.Services.AddTransient<IMailService, MailKitService>();    

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

app.UseHttpsRedirection();

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
