const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const clients = {};
const cors = require("cors");

io.on("connect", (client) => {
  client.on("join", (c) => {
    const id = c.user_id;
    client.id = id;
    client.user_id = id;
    if (clients[id]) {
      clients[id].push(client);
    } else {
      clients[id] = [client];
    }
  });
  client.on("message", (message) => {
    const { sender, receiverId } = message;
    console.log(sender);
    const senderId = sender.user_id;
    if (senderId && clients[senderId]) {
      clients[senderId].forEach((client) => {
        client.emit("message", message);
      });
    }
    if (receiverId && clients[receiverId]) {
      clients[receiverId].forEach((client) => {
        client.emit("message", message);
      });
    }
  });
  client.on("disconnect", () => {
    if (!client.user_id || !clients[client.user_id]) {
      return;
    }
    let targetClients = clients[client.user_id];
    for (let i = 0; i < targetClients.length; ++i) {
      if (targetClients[i] == client) {
        targetClients.splice(i, 1);
      }
    }
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/user-list", (req, res) => {
  return res.json([
    {
      id: "123",
      type: "personal",
      name: "Tes",
    },
    {
      id: "213",
      type: "group",
      name: "Tis",
    },
    {
      id: "221",
      type: "personal",
      name: "Tos",
    },
  ]);
});

server.listen(1234);
