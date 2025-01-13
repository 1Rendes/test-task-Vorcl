import axios from "axios";
import { StockCollection } from "../db/models/stock.js";

const getStocks = async (country, symbol, page) => {
  const documentsPerPage = 5;
  const skip = (page - 1) * documentsPerPage;
  const stocksQuery = StockCollection.find();
  if (country) stocksQuery.where("country").regex(new RegExp(country, "i"));
  {
    stocksQuery.where({
      $or: [
        { symbol: { $regex: new RegExp(symbol, "i") } },
        { name: { $regex: new RegExp(symbol, "i") } },
      ],
    });
  }
  const stocksLength = await StockCollection.find()
    .merge(stocksQuery)
    .countDocuments();
  const stocks = await stocksQuery.skip(skip).limit(documentsPerPage).exec();
  const totalPages = Math.ceil(stocksLength / documentsPerPage);
  return { stocks, totalPages, page, documentsPerPage };
};

export default getStocks;
