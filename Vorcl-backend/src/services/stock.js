import axios from "axios";
import { StockCollection } from "../db/models/stock.js";

const getStocks = async (country, symbol, page = 1) => {
  const documentsPerPage = 5;
  const skip = (1 - 1) * documentsPerPage;
  const stocksQuery = StockCollection.find();
  if (country) stocksQuery.where("country").regex(new RegExp(country, "i"));
  if (symbol) stocksQuery.where("symbol").regex(new RegExp(symbol, "i"));
  const stocks = await stocksQuery.skip(skip).limit(documentsPerPage).exec();
  return stocks;
};

export default getStocks;
