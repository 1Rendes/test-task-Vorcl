import stockController from "../constrollers/stock.js";

const stock = async (fastify) => {
  fastify.get("/stock", {
    handler: stockController,
  });
};

export default stock;
