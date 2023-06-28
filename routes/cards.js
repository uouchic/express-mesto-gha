const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
router.get('/cards', getCards);

// создаёт карточку места
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2).max(30)
        .pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
    }),
  }),
  createCard,
);

// удаляет карточку по идентификатору
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCardById,
);

// поставить лайк карточке
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

// убрать лайк с карточки
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard,
);

router.use(errors());

module.exports = router;
