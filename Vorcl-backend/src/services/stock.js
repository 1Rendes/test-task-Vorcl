import axios from "axios";
import { StockCollection } from "../db/models/stock.js";
import createHttpError from "http-errors";

const calculateDynamics = (c, o) => {
  if (o === 0) return 0;
  const dynamics = ((c - o) / o) * 100;
  return +dynamics.toFixed(2);
};

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

  const stockUrl = "https://api.polygon.io/v2/aggs/ticker";
  const apikey = process.env.POLYGONIO_API_KEY;
  const today = new Date();
  const prevMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  )
    .toISOString()
    .split("T")[0];
  const todayInString = today.toISOString().split("T")[0];
  const pricePromises = stocks.map((stock) =>
    axios.get(
      `${stockUrl}/${stock.symbol}/range/1/day/${prevMonth}/${todayInString}?sort=asc&apikey=${apikey}`
    )
  );
  try {
    const stockPrices = await Promise.all(pricePromises);
    stocks.forEach((stock, i) => {
      const lastDayClosePrice =
        stockPrices[i].data.results[stockPrices[i].data.results.length - 1].c;
      const lastDayOpenPrice =
        stockPrices[i].data.results[stockPrices[i].data.results.length - 1].o;
      const firstDayOpenPrice = stockPrices[i].data.results[0].o;
      stock._doc.price = lastDayClosePrice;
      stock._doc.percentPerDay = calculateDynamics(
        lastDayClosePrice,
        lastDayOpenPrice
      );
      stock._doc.percentPerMonth = calculateDynamics(
        lastDayClosePrice,
        firstDayOpenPrice
      );
    });
    return { stocks, totalPages, page, documentsPerPage };
  } catch (error) {
    console.log(error);
    throw createHttpError(error);
  }
};

export default getStocks;
