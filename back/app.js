const express = require("express");

const app = express();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
   "mongodb+srv://davidflooze:Qd3Ozc2ccPjF6Xo6@cluster0.k1iwwov.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
   const collection = client.db("test").collection("devices");
   // perform actions on the collection object
   client.close();
});

app.use(express.json());

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

module.exports = app;
