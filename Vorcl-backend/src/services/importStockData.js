import fs from "fs";
import csv from "csv-parser";
import { StockCollection } from "../db/models/stock.js";

export async function importStockData(filePath) {
  const stocks = [];
  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          stocks.push({
            symbol: row.Symbol,
            name: row.Name,
            marketCap: row["Market Cap"],
            country: row.Country,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    await StockCollection.insertMany(stocks);
    console.log("Symbols succesfully imported to MongoDB!");
  } catch (error) {
    console.error("Data import error:", error);
  }
}
