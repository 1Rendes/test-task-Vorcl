import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import webSocket from "./routes/websocket.js";
export const options = {};
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 3000;

fastify.register(fastifyWebsocket);
fastify.register(webSocket);
fastify.listen({ port: PORT });
