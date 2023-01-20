const express = require ("express")
const { getSauces, createSauce, getSauceById, deleteSauceById, modifySauce } = require("../controllers/sauces");
const { authenticateUser} = require ("../middleware/auth")
const { upload } = require("../middleware/multer")
const saucesRouter = express.Router()



saucesRouter.get("/", authenticateUser, getSauces);
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauce)
saucesRouter.get("/:id", authenticateUser, getSauceById)
saucesRouter.delete("/:id", authenticateUser, deleteSauceById)
saucesRouter.put("/:id", authenticateUser, upload.single("image"), modifySauce)

module.exports = {saucesRouter}