using Microsoft.AspNetCore.Http.HttpResults;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddLogging();

var app = builder.Build();
app.UseWebSockets();



var connectionList = new ConcurrentDictionary<Guid, WebSocket>();
//app.Map("/", () => "Hello World!");
app.Map("/joinRoom", async context => {

    if (context.WebSockets.IsWebSocketRequest)
    {
        var ws = await context.WebSockets.AcceptWebSocketAsync();
        var id = Guid.NewGuid();
        connectionList.TryAdd(id, ws);
        var buffer = new ArraySegment<byte>(new byte[1024]);
        while (ws.State == WebSocketState.Open)
        {
            var result = await ws.ReceiveAsync(buffer, CancellationToken.None);
            var parsedMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
            if (parsedMessage.Length > 0)
            {
                await BroadCast(buffer);
            }
        }
        connectionList.TryRemove(id, out var closedws);
    }
    else
    {
        Console.WriteLine("Boooooo!!!!");
    }
});

async Task BroadCast(ArraySegment<byte> message)
{
    foreach (var connectedClient in connectionList.Values)
    {
        if (connectedClient.State == WebSocketState.Open)
        {
            await connectedClient.SendAsync(message, WebSocketMessageType.Text, true, CancellationToken.None);
        }
    }
}

var clientConnections = new ConcurrentDictionary<string, ClientWebSocket>();

app.Map("/MimicClient", async context =>
{
    var client = new ClientWebSocket();
    var clientName = context.Request.Query["name"];
    if (clientConnections.ContainsKey(clientName))
    {
        Console.WriteLine($"{clientName} is already connected!!!");
        return;
    }
    clientConnections.TryAdd(clientName, client);
    await client.ConnectAsync(new Uri("wss://localhost:7075/joinRoom"), CancellationToken.None);
    var helloMessage = $"Heyy!! My name is {clientName}";
    var msgToSend = new ArraySegment<byte>(Encoding.UTF8.GetBytes(helloMessage));
    Console.WriteLine($"Waiting in lobby for my connection to get accepted.");
    while (client.State != WebSocketState.Open)
    {
        Console.WriteLine(".");
    }

    await client.SendAsync(msgToSend, WebSocketMessageType.Text, true, CancellationToken.None);
    var bufferReceived = new ArraySegment<byte>(new byte[1024]);
    while (client.State != WebSocketState.Aborted)
    {
        var result = await client.ReceiveAsync(bufferReceived, CancellationToken.None);
        var decodeMessage = Encoding.UTF8.GetString(bufferReceived.Array, 0, result.Count);
        Console.WriteLine($"Message for {clientName}: {decodeMessage}");
    }
});

app.Map("/CloseConnection", async context =>
{
    var name = context.Request.Query["name"];
    var isPresent = clientConnections.ContainsKey(name);

    if (isPresent)
    {
        var client = clientConnections[name];
        await client.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes($"{name} has left the chat :(")), WebSocketMessageType.Text, true, CancellationToken.None);
        await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "User has closed the connection", CancellationToken.None);
        var res = clientConnections.TryRemove(name, out var conn);
        conn.Dispose();
    }
    else
    {
        Console.WriteLine($"{name} is not present.");
    }
});

await app.RunAsync();