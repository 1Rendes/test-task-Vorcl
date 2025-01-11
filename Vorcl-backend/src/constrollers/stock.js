import getStock from "../services/stock.js";

const stockController = async (req, rep) => {
  const { country, symbol, page } = req.query;
  const stocks = await getStock(country, symbol, page);
  rep.status(200).send({
    status: 200,
    message: "Stocks succesfully found.",
    data: stocks,
  });
};

export default stockController;
