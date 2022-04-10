const express = require("express"); //'express' c'est le package deja installé
const cors = require('cors') //pour que le serveur accepte la requete qui vient du port 3000
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
require("dotenv").config()

const app = express(); //instance d'express nommé app

app.use(cors())
app.use(express.json())
app.use("/user", userRouter); 
//database connexion
mongoose
  .connect(
    process.env.database_url
  )
  .then(
    () => {
      console.log("Database connected ");
    },
    (err) => {
      console.log("error   " , err);
    }
  );

//Demarrage serveur
app.listen(8080, () => {
  console.log("server started on port 8080");
});

