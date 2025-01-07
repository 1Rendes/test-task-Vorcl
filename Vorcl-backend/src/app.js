import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";
import webSocket from "./routes/websocket.js";
export const options = {};
import dotenv from "dotenv";
import form from "./routes/form.js";
import pino from "pino";

dotenv.config();

const setupServer = async () => {
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  const PORT = process.env.PORT || 3000;

  fastify.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Application-json"],
  });
  fastify.register(fastifyWebsocket);
  fastify.register(webSocket);
  fastify.register(form);
  fastify.listen({ port: PORT });
};

export default setupServer;
