const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/router");
const errorHandler = require("./middlewares/errorHandler");
const mongoose = require("mongoose");
const User = require("./models/user");
const path = require("path");
//connecting to the database

mongoose.connect(
  "mongodb://localhost:27017/usersDataBase",
  { useNewUrlParser: true },
  () => {
    console.log("...db connected");
  },
  (e) => {
    console.log(e);
  }
);
//configuration
const app = express();
dotenv.config();

//middlewares
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", router);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler);

//listening of port
const appPort = process.env.APP_PORT || 3000;

app.listen(appPort, () => {
  console.log(`the server is running on the port ${appPort}`);
});
