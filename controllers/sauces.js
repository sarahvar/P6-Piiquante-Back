const { response } = require("express");
const mongoose = require("mongoose");
const unlink = require("fs").promises.unlink;

const product = new mongoose.Schema({
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

const Product = mongoose.model("Product", product);

function getSauces(req, res) {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => res.status(500).send(error));
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
    .catch((err) => res.status(500).send({ message: err }));
}

function deleteImage(product) {
  if (product == null) return;
  const imageUrl = product.imageUrl;
  const fileToDelete = imageUrl.split("/").at(-1);
  return unlink(`images/${fileToDelete}`).then(() => product);
}

function modifySauce(req, res) {
  const { id } = req.params;

  console.log("req.file", req.file);

  const hasNewImage = req.file != null;
  const payload = makePayload(hasNewImage, req);

  Product.findByIdAndUpdate(id, payload)
    .then((dbResponse) => handleUpDate(dbResponse, res))
    .catch((err) => console.error("PROBLEME UPDATING", err));
}
function makePayload(hasNewImage, req) {
  console.log("hasNewImage", hasNewImage);
  if (!hasNewImage) return req.body;
  const payload = JSON.parse(req.body.sauce);
  payload.imageUrl = makeImageUrl(req, req.file.fileName);
  console.log("NOUVELLE IMAGE A GERER");
  console.log("voici le payload:", payload);
  return payload;
}

function handleUpDate(dbResponse, res) {
  if (dbResponse == null) {
    console.log("NOTHING TO UPDATE");
    res.status(404).send({ message: "Objet not found in database" });
  }
  console.log("ALL GOOD, UPDATING", dbResponse);
  res.status(200).send({ message: "Successfully updated" });
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName;
}

function createSauce(req, res) {
  const { body, file } = req;
  const fileName = file.fileName;

  const sauce = JSON.parse(body.sauce);

  const name = sauce.name;
  const manufacturer = sauce.manufacturer;
  const description = sauce.description;
  const mainPepper = sauce.mainPepper;
  const heat = sauce.heat;
  const userId = sauce.userId;

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
    .catch(console.error);
}
function evaluateSauce(req, res) {
  Product.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                // Si la sauce n'est pas aimée
                case -1:
                    Product.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (dislike) !" }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                
                case 0:
                    // Si la sauce est déjà aimée et que l'utilisateur veut retirer son like
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Product.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Votre avis a bien été modifié (like retiré) !" }))
                            .catch(error => res.status(400).json({ error }))
                    }

                    // Si la sauce n'est déjà pas aimée et que l'utilisateur veut retirer son dislike
                    else if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Product.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => res.status(201).json({ message: "Votre avis a bien été modifié (dislike retiré) !" }))
                            .catch(error => res.status(400).json({ error }))
                    }
                    break;
                
                // Si la sauce est aimée
                case 1:
                    Product.updateOne({ _id: req.params.id }, {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId },
                        _id: req.params.id
                    })
                        .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" }))
                        .catch(error => res.status(400).json({ error }))
                    break;
                default:
                    return res.status(500).json({ error });
            }
        })
        .catch(error => res.status(500).json({ error }));
}

module.exports = {
  getSauces,
  createSauce,
  getSauceById,
  deleteSauceById,
  modifySauce,
  evaluateSauce,
}

