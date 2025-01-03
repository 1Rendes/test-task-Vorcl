import { WebSocket } from "ws";
import fastifyWebSocket from "@fastify/websocket";
import { extractAudioChannelData } from "./audio.js";

export class OpenAI {
  constructor() {
    this.serverSocket = null;
    this.clientSocket = null;
    this.base64Audio = null;
    this.message = null;
    this.error = null;
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.sessionUpdateConfig = {
      type: "session.update",
      session: {
        modalities: ["text"],
        instructions: "You are a helpful assistant.",
        input_audio_format: "pcm16",
        max_response_output_tokens: 1024,
      },
    };
  }
  inputAppend(base64Audio) {
    return JSON.stringify({
      type: "input_audio_buffer.append",
      audio: base64Audio,
    });
  }
  inputCommit() {
    return JSON.stringify({
      type: "input_audio_buffer.commit",
    });
  }
  connect(clientSocket) {
    const URL = "wss://api.openai.com/v1/realtime";
    const Model = "gpt-4o-mini-realtime-preview";
    const connectionAddress = URL + "?model=" + Model;

    this.clientSocket = clientSocket;
    this.serverSocket = new WebSocket(connectionAddress, {
      headers: {
        Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        "OpenAI-Beta": "realtime=v1",
      },
    });
    this.serverSocket.on("open", this.onOpen);
    this.serverSocket.on("message", this.onMessage);
    this.serverSocket.on("error", this.onError);
    this.serverSocket.on("close", this.onClose);
  }
  onOpen() {
    console.log("Connected to OpenAI WebSocket.");
    try {
      this.serverSocket.send(JSON.stringify(this.sessionUpdateConfig));
    } catch (error) {
      console.log(error);
    }
  }
  onMessage(e) {
    const serverEvent = JSON.parse(e);
    console.log("Response from OpenAI:", serverEvent);
    if (serverEvent.type === "response.done") {
      this.clientSocket.send(
        JSON.stringify(serverEvent.response.output[0].content[0].text)
      );
    }
  }
  send(blob) {
    const int16Array = extractAudioChannelData(blob);
    // const messageObject = {
    //   type: "conversation.item.create",
    //   item: {
    //     type: "message",
    //     role: "user",
    //     content: [
    //       {
    //         type: "input_audio",
    //         audio: int16Array.toString("base64"),
    //       },
    //     ],
    //   },
    // };
    // this.serverSocket.send(JSON.stringify(messageObject));
    // this.serverSocket.send(this.inputAppend(message));
    // this.serverSocket.send(this.inputCommit());
  }
  onError(error) {
    console.error("OpenAI WebSocket error:", error);
  }
  onClose() {
    console.log("OpenAI WebSocket connection closed.");
  }
  close() {
    this.serverSocket = null;
  }
}
