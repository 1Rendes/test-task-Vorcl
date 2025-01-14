import getStock from "../services/stock.js";

const stockController = async (req, reply) => {
  const { country, symbol, page } = req.query;
  try {
    const stocks = await getStock(country, symbol, page);
    reply.status(200).send({
      status: 200,
      message: "Stocks succesfully found.",
      data: stocks,
    });
  } catch ({ status, message }) {
    reply.status(status).send({ status, message });
  }
};

export default stockController;
