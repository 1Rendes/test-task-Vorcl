import getStock from "../services/stock.js";

const stockController = async (req, rep) => {
  const { country, symbol, page } = req.query;
  const stocks = await getStock(country, symbol, page);
  rep.status(200).send(stocks);
};

export default stockController;
