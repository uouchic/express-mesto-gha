const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/users', getUsers);

// возвращает пользователя по _id
router.get('/users/:userId', getUserById);

// обновляет профиль
router.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
updateUser);

// обновляет аватар
router.patch('/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).uri(),
    }),
  }),

updateAvatar);

router.use(errors());

module.exports = router;
