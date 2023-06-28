const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

// возвращает пользователя по _id
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);

// обновляет профиль
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser,
);

// обновляет аватар профиля
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
    }),
  }),

  updateAvatar,
);

router.use(errors());

module.exports = router;
