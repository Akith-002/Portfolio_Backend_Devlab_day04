const mongoose = require("mongoose"); //intermediate between our app and mongodb
const dotenv = require("dotenv");
dotenv.config();

const dbURI = process.env.DB_URL;

if (!dbURI) {
  throw new Error("MongoDB URL is required.");
}

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

module.exports = mongoose;
