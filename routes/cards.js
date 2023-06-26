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

// создаёт карточку
router.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2).max(30)
        .uri(),
    }),
  }),
  createCard);

// удаляет карточку по идентификатору
router.delete('/cards/:cardId', deleteCardById);

// поставить лайк карточке
router.put('/cards/:cardId/likes', likeCard);

// убрать лайк с карточки
router.delete('/cards/:cardId/likes', dislikeCard);

router.use(errors());

module.exports = router;
