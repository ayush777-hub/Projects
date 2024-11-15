using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;
var clientConnections = new ConcurrentDictionary<string, ClientWebSocket>();

var client = new ClientWebSocket();
var clientName = Guid.NewGuid().ToString();
if (clientConnections.ContainsKey(clientName))
{
    Console.WriteLine($"{clientName} is already connected!!!");
    return;
}
clientConnections.TryAdd(clientName, client);
await client.ConnectAsync(new Uri("ws://localhost:7075/joinRoom"), CancellationToken.None);
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