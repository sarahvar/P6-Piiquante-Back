const {User} = require("../mongo")
const bcrypt = require("bcrypt")

async function createUser(req, res) {
    const email = req.body.email
    const password = req.body.password
    
    const hashedPassword = await hashPassword(password)

    //Ne pas oublier de remettre la contrainte d'emails uniques mongoDB".
    const user = new User({ email, password: hashedPassword})
    console.log('password:', password)
    console.log('hashedPassword:', hashedPassword)
    
  user.save()
    .then(() => res.send({ message: "Utilisateur enregistré !" }))
    .catch(err => console.log("User pas enregistré", err))
  }

  function hashPassword(password){
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds)

    return"pouet"
  }

module.exports = {createUser}