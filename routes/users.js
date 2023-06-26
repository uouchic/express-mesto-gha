const router = require('express').Router();
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
router.patch('/users/me', updateUser);

// обновляет аватар
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
