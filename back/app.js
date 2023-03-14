const express = require("express");

const hotOnesRoutes = require("./routes/HotOnes");
const userRoutes = require("./routes/user");

const path = require("path");
const mongoose = require("mongoose");
require('dotenv').config();

const cors = require("cors");
const helmet = require("helmet");

const app = express();

mongoose.set("strictQuery", true);
mongoose
   .connect(
      process.env.MONGODB,
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());

app.use(express.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/api/sauces", hotOnesRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
