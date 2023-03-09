const express = require("express");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

const path = require("path");
const mongoose = require("mongoose");

const cors = require("cors");
const helmet = require("helmet");

const app = express();

mongoose.set("strictQuery", true);
mongoose
   .connect(
      "mongodb+srv://DCardon:i9vuo9IE3V5w43Cp@cluster0.vf47xko.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(cors());

app.use(express.json());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use("/api/stuff", stuffRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
