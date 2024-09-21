const { urlencoded } = require("express");
const mongoose = require("./db");

const competitionSchema = new mongoose.Schema({
  index: Number,
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
  url: String,
  image: String,
});

const Competition = mongoose.model("Competition", competitionSchema);

module.exports = Competition;
