using SimpleSocketChat;
using System.Net.WebSockets;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddLogging();
var app = builder.Build();

app.UseWebSockets();
app.MapGet("/", () => "HEALTHY!");
var roomsDictionary = new Dictionary<Guid, Room>();
app.Map("/getAvailableRoom", () =>
{
    var roomGuidLists = roomsDictionary.Keys.ToList();
    return roomGuidLists;
});
app.Map("/createRoom", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var ws = await context.WebSockets.AcceptWebSocketAsync();
        var userguid = Guid.NewGuid();
        Console.WriteLine($"Connection accepted for guid:{userguid}");
        var roomGuid = Guid.NewGuid();
        var room = new Room();
        roomsDictionary.Add(roomGuid, room);
        JoinRoom(room, userguid, ws);
        await RecieveMessageAsync(ws,roomGuid,userguid);
    }
    else
    {
        Console.WriteLine("Demn you invoked the Http endpoint of the application.");
    }
});

async Task RecieveMessageAsync(WebSocket ws, Guid roomGuid, Guid userguid)
{
    while (ws.State == WebSocketState.Open)
    {
        var buffer = new byte[1024];
        var messageReceieved = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        Console.WriteLine($"Message from #{userguid}: {messageReceieved}");
        var message = Encoding.UTF8.GetString(buffer);
        BroadCastRoom(roomGuid, userguid, buffer);
    }
}

async Task BroadCastRoom(Guid roomGuid, Guid userguid, byte[] buffer)
{
    if(roomsDictionary.TryGetValue(roomGuid, out Room room))
    {
        await Parallel.ForEachAsync(room.connections.Where(x => x.Key != userguid).ToList(), async (user, cancellationToken) =>
        {
            var userConn = user.Value;
            await userConn.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
        });
    }

}

app.Map("/connectRoom/{roomId}", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var ws = await context.WebSockets.AcceptWebSocketAsync();
        var userguid = Guid.NewGuid();
        Console.WriteLine($"Connection accepted for guid:{userguid}");
        var roomID = context.GetRouteValue("roomId").ToString();
        var roomGuid = Guid.Parse(roomID);
        Room room = null;
        if (roomsDictionary.ContainsKey(roomGuid))
        {
            room = roomsDictionary[roomGuid];
        }
        else
        {
            await ws.SendAsync(new ArraySegment<byte>(Encoding.UTF8.GetBytes("Dude!!! No room with this Id is currently active.")),
                WebSocketMessageType.Text,true,CancellationToken.None);
            await ws.CloseAsync(WebSocketCloseStatus.NormalClosure,"No active sessions with this room Id", CancellationToken.None);
            return;
        }
        JoinRoom(room, userguid, ws);
        await RecieveMessageAsync(ws, roomGuid, userguid);
    }
    else
    {
        Console.WriteLine("Demn you invoked the Http endpoint of the application.");
    }
});

void JoinRoom(Room room, Guid userGuid, WebSocket wsConn)
{
    if (room.connections.ContainsKey(userGuid))
    {
        return;
    }
    room.connections.Add(userGuid, wsConn);
}

await app.RunAsync();
