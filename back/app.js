const express = require("express");
const app = express();
const mongoose = require("mongoose");

const stuffRoutes = require('./routes/sauce');
const userRoutes = require('./routes/User');

mongoose.set("strictQuery", true);
mongoose
   .connect(
      "mongodb+srv://DCardon:i9vuo9IE3V5w43Cp@cluster0.vf47xko.mongodb.net/?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
   )
   .then(() => console.log("Connexion à MongoDB réussie !"))
   .catch(() => console.log("Connexion à MongoDB échouée !"));



app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
   );
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   );
   next(); 
});

app.use(express.json());

app.use('/api/stuff', stuffRoutes);
app.use('/api/autj', userRoutes);

module.exports = app;
