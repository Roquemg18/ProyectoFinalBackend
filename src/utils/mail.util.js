const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "molinaroque871@gmail.com",
    pass: "astwsufafirnhymf",
  },
});

module.exports = transport;
