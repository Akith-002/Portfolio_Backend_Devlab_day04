const mongoose = require("mongoose"); //intermediate between our app and mongodb

const dbURI = process.env.DB_URL;

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

module.exports = mongoose;
