const app = require("express")();
const server = require("http").createServer(app);
const { v4 } = require('uuid')
const io = require("socket.io")(server);
const db = require('./db')

io.on('connection', socket => {
  socket.on('get-user', async () => {
    const users = await db('users')
    socket.emit('user-list', users)
  })

  socket.on('join-room', async (user1, user2) => {
    let roomID = ""
    const [room, _] = await
      db.raw(`
      select gu2.group_id 
      from groups_users gu1
      inner join groups_users gu2 
      on gu1.group_id = gu2.group_id
      where ((gu1.user_id = "${user1}" 
      AND gu2.user_id = "${user2}") 
      OR (gu1.user_id = "${user2}" )
      AND gu2.user_id = "${user1}") AND gu1.user_id != gu2.user_id`)

    if (room.length === 0) {
      roomID = v4()
      await db('groups').insert({
        id: roomID
      })
      await db('groups_users').insert([
        {
          group_id: roomID,
          user_id: user1
        },
        {
          group_id: roomID,
          user_id: user2
        }
      ])
    }else{
      roomID = room[0].group_id
      socket.join(roomID)
      io.to(roomID).emit('welcome')
    }
  })
})

server.listen(1234);
