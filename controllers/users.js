const { User } = require("../mongo")
const bcrypt = require("bcrypt")//Bibliothèque qui aide à hacher les MDP
const jwt = require("jsonwebtoken")//Permets de créer et vérifier les tokens d'authentification

//Création de l'utilisateur 
async function createUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send({ message: "Utilisateur enregistré !" });
  } catch (err) {
    res.status(409).send({ message: "Utilisateur pas enregistré : " + err });
  }
}

//hachage du mot de passe
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}


//enregistrement de l'utilisateur 
async function logUser(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });

    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      res.status(403).send({ message: "Mot de passe incorrect" });
    }

    //Statut de la requête par rapport au Token
    const token = createToken(email);
    res.status(200).send({ userId: user?._id, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Une erreur interne" });
  }
}

//Création d'un Token une fois l'adresse mail valider
function createToken(email) {
  const jwtPassword = process.env.JWT_PASSWORD;
  return jwt.sign({ email: email }, jwtPassword, { expiresIn: "24h" });
}


//Exporter createUser et logUser
module.exports = { createUser, logUser };
