const express = require("express"); //'express' c'est le package deja installé
const cors = require('cors') //pour que le serveur accepte la requete qui vient du port 3000
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");

const app = express(); //instance d'express nommé app

app.use(cors())
app.use(express.json())
app.use("/user", userRouter); 
//database connexion
mongoose
  .connect(
    "mongodb+srv://benrhayemranim:ranim123@branper.x63fq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(
    () => {
      console.log("Database connected!!");
    },
    (err) => {
      console.log("error");
    }
  );

//Demarrage serveur
app.listen(8080, () => {
  console.log("server started on port 8080");
});

