const { app, express } = require ("./server")
const { saucesRouter } = require ("./routers/sauces.router")
const { authRouter } = require("./routers/auth.router")
const port = 3000;
const path = require ("path") 

//Connection to Database
require("./mongo");


//Middleware
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)


app.get("/", (req, res) => res.send("Hello World!"));


//Listen port
app.use("/images", express.static(path.join(__dirname, "images")));
app.listen(port, () => console.log("Listening on port " + port));


