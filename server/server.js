import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const players = [];

io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);

  players.push({
    socket: socket,
    online: true,
    playername: null,
  });

  socket.on("request_to_play", (data) => {
    const currentPlayer = players.find((player) => player.socket === socket);
    currentPlayer.playername = data.playername;

    const opponent = players.find(
      (player) =>
        player.playername &&
        player.playername !== currentPlayer.playername &&
        player.online
    );

    if (opponent) {
      // Assign opponent and notify both players
      socket.emit("opponent_found", {
        opponentName: opponent.playername,
        playingAs: "circle",
      });

      opponent.socket.emit("opponent_found", {
        opponentName: currentPlayer.playername,
        playingAs: "cross",
      });

      // Set up move handling for both players
      currentPlayer.socket.on("player-move-from-client", (data) => {
        opponent.socket.emit("player-move-from-server", { ...data });
      });

      opponent.socket.on("player-move-from-client", (data) => {
        currentPlayer.socket.emit("player-move-from-server", { ...data });
      });
    } else {
      console.log("Waiting for an opponent...");
    }
  });

  socket.on("disconnect", () => {
    const player = players.find((player) => player.socket === socket);
    if (player) {
      player.online = false;
      console.log(`Player ${player.playername || socket.id} disconnected`);
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
