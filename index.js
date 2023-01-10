console.log("Hello World")
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

//Database
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://Varin:Lucky45000@cluster0.bbuwmdq.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then(() => console.log("Connected to Mongo!"))
  .catch((err) => console.error("Error connecting to Mongo", err))


//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.post("/api/auth/signup", (req, res) => {
    console.log("Signup request:", req.body)
    res.send({message: "Utilisateur enregistré !"})
})
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => console.log("Listening on port " + port))