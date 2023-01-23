const express = require("express");
const {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauceById,
  modifySauce,
  evaluateSauce,
} = require("../controllers/sauces");
// On récupère la constatente authenticatUser dans le dossier middleware avec le fichier auth 
const { authenticateUser } = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const saucesRouter = express.Router();

//Routes des sauces
saucesRouter.get("/", authenticateUser, getSauces);
saucesRouter.post("/", authenticateUser, upload.single("image"), createSauce);
saucesRouter.get("/:id", authenticateUser, getSauceById);
saucesRouter.delete("/:id", authenticateUser, deleteSauceById);
saucesRouter.put("/:id", authenticateUser, upload.single("image"), modifySauce);
saucesRouter.post("/:id/like", authenticateUser, evaluateSauce);

//Exporter saucesRouter
module.exports = { saucesRouter };

