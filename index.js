const { app, express } = require ("./server")
const port = 3000;
const path = require ("path") 

//Connection to Database
require("./mongo");


//Controllers
const { createUser, logUser } = require("./controllers/users");
const { getSauces, createSauce, getSauceById, deleteSauceById } = require("./controllers/sauces");

//Middleware
const { upload } = require("./middleware/multer")
const { authenticateUser} = require ("./middleware/auth")


//Routes
app.post("/api/auth/signup", createUser);
app.post("/api/auth/login", logUser);
app.get("/api/sauces", authenticateUser, getSauces);
app.post("/api/sauces", authenticateUser, upload.single("image"), createSauce);
app.get("/api/sauces/:id", authenticateUser, getSauceById)
app.delete("/api/sauces/:id", authenticateUser, deleteSauceById)
app.get("/", (req, res) => res.send("Hello World!"));


//Listen port
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("Listening on port " + port));


