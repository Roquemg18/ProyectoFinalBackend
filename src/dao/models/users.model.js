const mongoose = require("mongoose");

const collectionName = "user";

const collectionSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: Number,
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["admin", "user", "premium"],
    default: "user",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  last_connection: { type: Date, default: null },
  status: { type: String, enum: ["user", "premium"], default: "user" },
});

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;
