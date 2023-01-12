const mongoose = require("mongoose");
const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const uri = `mongodb+srv://${username}:${password}@cluster0.bbuwmdq.mongodb.net/?retryWrites=true&w=majority`;


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

module.exports = {mongoose, User}