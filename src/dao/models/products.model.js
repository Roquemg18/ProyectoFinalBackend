const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const collectionName = "products";

const collectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: String,
  stock: Number,
  category: String,
  thumbnail: String,
  owner: {
    type: String,
    required: true,
    default: "admin",
    ref: "user",
  },
});

collectionSchema.plugin(mongoosePaginate);
const Products = mongoose.model(collectionName, collectionSchema);

module.exports = Products;
