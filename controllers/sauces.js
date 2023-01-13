const jwt = require("jsonwebtoken")

const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    userId :  { type: String, required: true },
    name: { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { type: Number, default: 0},
    dislikes : { type: Number, default: 0},
    usersLiked : {type: [String]},
    usersDisliked : {type: [String]}
})

const Product = mongoose.model("Product", productSchema)


function getSauces(req, res){
const header = req.header("Authorization")
if (header == null) return res.status(403).send({ message: "Invalide"})

const token = header.split(" ")[1]
if (token == null) return res.status(403).send({ message: "Token ne peut pas être nulle"})


jwt.verify(token, process.env.JWT_PASSWORD, 
(err, decoded) => handleToken(err, decoded, res))

}

function handleToken(err, decoded, res){
if (err) res.status(403).send({ message: "Token invalide" + err })
else{
    console.log("token à l'air okay", decoded)
    Product.find({}).then(products => res.send(products))
    //res.send({message: [{sauce: "sauce1"}, {sauce: "sauce1"} ]})
}
}
function createSauce(req, res) {
const product = new Product({
    userId: "luna",
    name: "prudelle",
    manufacturer: "espelette",
    description: "piquant",
    mainPepper: "poivre",
    imageUrl: "image",
    heat: 1,
    likes: 5,
    dislikes: 2,
    usersLiked: ["yeah"],
    usersDisliked: ["bouh"]
})
product.save().then((res) => console.log("Produit sauvegarder", res)).catch(console.error)
}
module.exports = {getSauces, createSauce}
