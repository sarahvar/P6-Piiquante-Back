const mongoose = require("mongoose");
const unlink = require("fs").promises.unlink

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

const Product = mongoose.model("Product", productSchema)

function getSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error))
}

function getSauceById(req, res) {
  const { id } = req.params;
  Product.findById(id)
    .then((product) => res.send(product))
    .catch(console.error);
}

function deleteSauceById(req, res) {
  const { id } = req.params;
  // 1.L'ordre de suppression du produit est envoyé à Mongo
  Product.findByIdAndDelete(id)
    // 2. Supprimer l'image localement
    .then(deleteImage)
    // 3. Envoyer un message de succès au client sur le site web
    .then((product) => res.send({ message: product }))
    .catch((err) => res.status(500).send({ message: err }))
}

function deleteImage(product) {
  const imageUrl = product.imageUrl;
  const fileToDelete = imageUrl.split("/").at(-1);
  return unlink(`images/${fileToDelete}`).then(() => product);
}

function modifySauce(req, res) {
  const { body, file } = req
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce
  const { id } = req.params
  console.log({ body, file })
  Product.findByIdAndUpdate(id, {
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    heat: heat,
    userId: userId,
  });
}

function createSauce(req, res) {
  const { body, file } = req;
  const fileName = file.fileName;

  const sauce = JSON.parse(body.sauce)

  const name = sauce.name;
  const manufacturer = sauce.manufacturer;
  const description = sauce.description;
  const mainPepper = sauce.mainPepper;
  const heat = sauce.heat;
  const userId = sauce.userId;

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
    .then((message) => {
      res.status(201).send({ message: message });
      return console.log("Produit enregistré", message);
    })
    .catch(console.error)
}
module.exports = {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauceById,
  modifySauce,
};
