import setupServer from "./app.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

const bootstrap = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error(`Exception in bootstrap ${error}`);
  }
};

bootstrap();
