import socketio from "socket.io-client";

const API_URL = "http://localhost:1234/";
const io = socketio.connect(API_URL);


export default io