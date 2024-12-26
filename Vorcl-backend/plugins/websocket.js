const fp = require("fastify-plugin");
const fastifyWebSocket = require("@fastify/websocket");
const { WebSocket } = require("ws");

module.exports = fp(async function (fastify, opts) {
  fastify.register(fastifyWebSocket);
  fastify.register(async function (fastify) {
    fastify.get("/ws", { websocket: true }, (socket, req) => {
      const OpenAiURL = "wss://api.openai.com/v1/realtime";
      const OpenAiModel = "gpt-4o-mini-realtime-preview";
      const OpenAiConnectionAddress = OpenAiURL + "?model=" + OpenAiModel;

      const sessionUpdateConfig = {
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: "You are a helpful assistant.",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          max_response_output_tokens: 1024,
        },
      };

      const openAIws = new WebSocket(OpenAiConnectionAddress, {
        headers: {
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
          "OpenAI-Beta": "realtime=v1",
        },
      });

      openAIws.on("open", () => {
        console.log("Connected to OpenAI WebSocket.");
        openAIws.send(JSON.stringify(sessionUpdateConfig));
      });

      openAIws.on("message", (e) => {
        const serverEvent = JSON.parse(e);
        console.log("Response from OpenAI:", serverEvent);
        if (serverEvent.type === "response.done") {
          socket.send(
            JSON.stringify(serverEvent.response.output[0].content[0].text)
          );
        }
      });

      socket.on("message", (message) => {
        const createConversationEvent = {
          type: "conversation.item.create",
          previous_item_id: null,
          item: {
            type: "message",
            role: "user",
            content: [
              {
                type: "input_text",
                text: message.toString(),
              },
            ],
          },
        };

        openAIws.send(JSON.stringify(createConversationEvent));
        openAIws.send(
          JSON.stringify({
            type: "response.create",
            response: { modalities: ["text"] },
          })
        );

        openAIws.send(message.toString());
        console.log("Message from client:", message.toString());
      });

      openAIws.on("error", (error) => {
        console.error("OpenAI WebSocket error:", error);
      });

      openAIws.on("close", () => {
        console.log("OpenAI WebSocket connection closed.");
      });

      socket.on("close", () => {
        console.log("Client WebSocket disconnected.");
        openAIws.close();
      });
    });
  });
});
