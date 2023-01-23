//Execute le fichier users dans le dossier controllers
const { createUser, logUser } = require("../controllers/users");

//Permet d'executer express et express Router
const express = require("express");
const authRouter = express.Router();

//Routes auth vers l'api signup,login et les fonctions createUser et logUser
authRouter.post("/signup", createUser);
authRouter.post("/login", logUser);

//Permet d'exporter authRouter
module.exports = { authRouter };
