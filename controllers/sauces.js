const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

const Product = mongoose.model("Product", productSchema);

function getSauces(req, res) {
  console.log("le token a été valider nous sommes dans les sauces");
  //console.log("token à l'air okay", decoded)
  Product.find({}).then((products) => res.send(products));
  //res.send({message: [{sauce: "sauce1"}, {sauce: "sauce1"} ]})
}

function createSauce(req, res) {
  const { body, file } = req;
  const fileName = file.fileName;

  const sauce = JSON.parse(body.sauce);

  const userId = sauce.userId;
  const name = sauce.name;
  const manufacturer = sauce.manufacturer;
  const description = sauce.description;
  const mainPepper = sauce.mainPepper;
  const heat = sauce.heat;

  function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName;
  }

  const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((res) => console.log("Produit enregistré", res))
    .catch(console.error);
}
module.exports = { getSauces, createSauce };
