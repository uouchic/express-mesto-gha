const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user.id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Аватар не обновлен, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      // eslint-disable-next-line eqeqeq
      if (card.owner == req.user.id) {
        return Card.findByIdAndRemove(cardId)
          // eslint-disable-next-line no-shadow
          .then((card) => {
            res.status(200).send(card);
          });
      }
      throw new ForbiddenError('Можно удалять только свои карточки');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка не удалена, некоректный id карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Лайк не поставлен, некоректный id карточки'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким id не найдена');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Лайк не удален, некоректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
