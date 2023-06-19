const Card = require("../models/card");

const getCards = (req, res) => {
  return Card.find({}).then((cards) => {
    return res.status(200).send(cards);
  });
};

const createCard = (req, res) => {
  const owner = req.user._id;

  const { name, link } = req.body;

  return Card.create({ name, link, owner }).then((newCard) => {
    return res.status(201).send(newCard);
  });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return Card.findByIdAndRemove(cardId).then((card) => {
    return res.status(200).send(card);
  });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  ).then((card) => {
    return res.status(200).send(card);
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  ).then((card) => {
    return res.status(200).send(card);
  });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
