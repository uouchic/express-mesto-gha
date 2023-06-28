const bcrypt = require('bcrypt');

const saltRounds = 10;
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-errors');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Пользователь не найден, некоректный id пользователя'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw new BadRequest('Не переданы email или пароль');
  }

  User.findOne({ email })

    .then((admin) => {
      if (admin) {
        throw new ConflictError('Пользователь с таким email уже существует');
      } else {
        return bcrypt.hash(password, saltRounds)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          }));
      }
    })
    .then((newUser) => res.status(201).send({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    }))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не создан, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updateUserData) => res.status(200).send(updateUserData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не обновлен, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateAvatarData) => res.status(200).send(updateAvatarData))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Аватар не обновлен, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Не переданы email или пароль');
  }

  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        throw new UnauthorizedError('Пользователя с таким email не существует');
      } else {
        bcrypt.compare(password, admin.password, (err, isPasswordMatch) => {
          if (!isPasswordMatch) {
            throw new UnauthorizedError('Неправильный пароль');
          }

          const token = jwt.sign({ id: admin._id }, 'some-secret-key', { expiresIn: '7d' });

          return res.status(200).send({ token });
        });
      }
    })

    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Пользователь не найден, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }
      return res.status(200).send(user);
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Пользователь не найден, переданы невалидные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
