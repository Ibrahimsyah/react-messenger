const app = require("express")();
const server = require("http").createServer(app);
const { v4 } = require("uuid");
const io = require("socket.io")(server);
const db = require("./db");
const sockets = {};

io.on("connection", (socket) => {
  socket.on("get-user", async () => {
    const users = await db("users");
    socket.emit("user-list", users);
  });

  socket.on("join", async (user_id) => {
    sockets[user_id] = socket;
    const rooms = await db("groups_users")
      .select("group_id")
      .where("user_id", user_id);
    rooms.forEach((room) => socket.join(room.group_id));
  });

  socket.on("disconnect", () => {
    const id = Object.keys(sockets).find((key) => sockets[key] === socket);
    delete sockets[id];
  });

  socket.on("join-room", async (user1, user2) => {
    let roomID = "";
    const [room, _] = await db.raw(`
      select gu2.group_id 
      from groups_users gu1
      inner join groups_users gu2 
      on gu1.group_id = gu2.group_id
      where ((gu1.user_id = "${user1}" 
      AND gu2.user_id = "${user2}") 
      OR (gu1.user_id = "${user2}" )
      AND gu2.user_id = "${user1}") AND gu1.user_id != gu2.user_id`);

    if (room.length === 0) {
      roomID = v4();
      await db("groups").insert({
        id: roomID,
      });
      await db("groups_users").insert([
        {
          group_id: roomID,
          user_id: user1,
        },
        {
          group_id: roomID,
          user_id: user2,
        },
      ]);
    } else {
      roomID = room[0].group_id;
    }
    socket.join(roomID);
    if (sockets[user2]) {
      sockets[user2].join(roomID);
    }
    const [recipient] = await db.raw(`select * from users where id = ${user2}`);
    const room_information = {
      id: roomID,
      user: recipient[0],
    };
    socket.emit("room-information", room_information);
  });

  socket.on("send-message", async (payload) => {
    const { from, to, roomID, message } = payload;
    const [userFrom] = await db("users").where("id", from);
    const [userTo] = await db("users").where("id", to);
    const messageModel = {
      from: userFrom,
      to: userTo,
      message: {
        id: v4(),
        message: message,
      },
    };
    io.to(roomID).emit("new-message", messageModel);
  });
});

server.listen(1234);
