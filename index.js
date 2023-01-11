console.log("Hello World");
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
  .catch((err) => console.error("Error connecting to Mongo", err));

const userSchema = new mongoose.Schema({
        email: String,
        password: String,
    }
)

const User = mongoose.model("User", userSchema)

//Middleware

app.use(cors());
app.use(express.json());

//Routes

app.post("/api/auth/signup", (req, res) => {
  console.log("Signup request:", req.body)
  const email = req.body.email
  const password = req.body.password
  //Ne pas oublier de remettre la contrainte d'emails uniques".
const user = new User({ email: email, password: password })
user.save()
  .then(res => console.log("User enregistré !", res))
  .catch(err => console.log("User pas enregistré", err))

  res.send({ message: "Utilisateur enregistré !" });
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => console.log("Listening on port " + port));
