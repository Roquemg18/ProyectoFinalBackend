const mongoose = require("mongoose");

const collectionName = "tickets";

const collectionSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: function () {
      return Math.random().toString(36).substr(2, 8);
    },
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

const Tickets = mongoose.model(collectionName, collectionSchema);

module.exports = Tickets;
