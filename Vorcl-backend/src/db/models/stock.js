import { Schema, model } from "mongoose";

const StockSchema = new Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    marketCap: {
      type: Number,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

StockSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const StockCollection = model("stock", StockSchema);
