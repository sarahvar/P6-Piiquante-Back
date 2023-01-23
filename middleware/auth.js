//MIDDLEWARE de /api/auth


const jwt = require("jsonwebtoken")//Permets de créer et vérifier les tokens d'authentification

//Fonction qui permets au serveur d'authoriser les requêtes de tous les headers (CORS)
function authenticateUser(req, res, next) {
  const header = req.header("Authorization");
  if (header == null) return res.status(403).send({ message: "Invalide" });

  const token = header.split(" ")[1];
  if (token == null)
    return res.status(403).send({ message: "Token ne peut pas être nulle" });

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(403).send({ message: "Token invalide" + err });
    console.log("Le token est bien valide, on continue");
    next();
  });
}

//Permets d'exporter authenticateUser
module.exports = { authenticateUser };
