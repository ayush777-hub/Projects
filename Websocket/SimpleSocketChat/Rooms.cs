using System.Net.WebSockets;

namespace SimpleSocketChat
{
    public class Room
    {
        public Dictionary<Guid,WebSocket> connections = new();
    };
}
