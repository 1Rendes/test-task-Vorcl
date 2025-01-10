import { importStockData } from "../services/importStockData.js";
import { StockCollection } from "./models/stock.js";

export async function stockUploader() {
  const numberOfStocks = await StockCollection.countDocuments();
  if (numberOfStocks > 0) return;
  //you can manualy download actual data from https://www.nasdaq.com/market-activity/stocks/screener
  importStockData("nasdaq_screener_1736549270602.csv");
}
