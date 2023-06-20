const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => res.status(500).send({ message: 'Непредвиденная ошибка' }));

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Пользователь с таким id не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Пользователь не найден, некоректный id пользователя',
        });
      }
      return res.status(500).send({ message: 'Непредвиденная ошибка' });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Пользователь не создан, переданы невалидные данные',
        });
      }
      return res.status(500).send({ message: 'Непредвиденная ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updateUserData) => res.status(200).send(updateUserData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Пользователь не обновлен, переданы невалидные данные',
        });
      }
      return res.status(500).send({ message: 'Непредвиденная ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateAvatarData) => res.status(200).send(updateAvatarData))
    .catch(() => res.status(400).send({ message: 'Аватар не обновлен' }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
