require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 3000;
const multer = require("multer");
const { authenticateUser } = require("./middleware/auth");
const path = require ("path") 
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
    cb(null, makeFilename(req, file));
  },
});

function makeFilename(req, file) {
  const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
  file.fileName = fileName
  return fileName
}

const upload = multer({ storage: storage });
//Connection to Database
require("./mongo");

//Controllers
const { createUser, logUser } = require("./controllers/users");
const { getSauces, createSauce } = require("./controllers/sauces");

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce);
app.get("/", (req, res) => res.send("Hello World!"));

//Listen port

app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("Listening on port " + port));
