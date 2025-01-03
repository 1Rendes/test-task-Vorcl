import { OpenAI } from "../services/OpenAI.js";

const webSocket = async (fastify, opts) => {
  fastify.get("/ws", { websocket: true }, (socket, req) => {
    handleWebSocket(socket);
  });

  function handleWebSocket(clientSocket) {
    const connection = new OpenAI();
    connection.connect(clientSocket);
    clientSocket.on("message", async (blob) => {
      connection.send(blob);
    });
    clientSocket.on("close", () => {
      console.log("Client WebSocket disconnected.");
      connection.close();
    });
    clientSocket.on("error", (error) => {
      console.log(error);
    });
  }
};

export default webSocket;
