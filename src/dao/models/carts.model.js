const mongoose = require("mongoose");

const collectionName = "carts";

const collectionSchema = new mongoose.Schema({
  carts: {
    product: { type: Array },
    quantity: { type: Number, default: 1 },
  },
});

const Carts = mongoose.model(collectionName, collectionSchema);

module.exports = Carts;
