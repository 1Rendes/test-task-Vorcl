import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import webSocket from "./routes/websocket.js";
export const options = {};
import dotenv from "dotenv";
import webRTC from "./routes/webRTC.js";

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 3000;

fastify.register(fastifyWebsocket);
fastify.register(webSocket);
fastify.register(webRTC);
fastify.listen({ port: PORT });
