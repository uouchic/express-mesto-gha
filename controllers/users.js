const bcrypt = require('bcrypt');

const saltRounds = 10;
const jwt = require('jsonwebtoken');

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

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы email или пароль' });
  }

  User.findOne({ email })

    // eslint-disable-next-line consistent-return
    .then((admin) => {
      if (admin) {
        res
          .status(409)
          .send({ message: 'Пользователь с таким email уже существует' });
      } else {
        return bcrypt.hash(password, saltRounds)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }));
      }
    })
    .then((newUser) => res.status(201).send(newUser))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Пользователь не создан, переданы невалидные данные' });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Аватар не обновлен, переданы невалидные данные',
        });
      }
      return res.status(500).send({ message: 'Непредвиденная ошибка' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Не переданы почта или пароль' });
  }

  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        res.status(401).send({ message: 'Пользователя с таким email не существует' });
      }

      bcrypt.compare(password, admin.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return res.status(401).send({ message: 'Неправильный пароль' });
        }

        // создаем и отдаем токен

        const token = jwt.sign({ id: admin._id }, 'some-secret-key', { expiresIn: '7d' });

        return res.status(200).send({ token });
      });
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Пользователь не найден, переданы невалидные данные' });
      }
      return res.status(500).send({ message: 'Непредвиденная ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
