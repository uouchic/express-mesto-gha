const User = require("../models/user");

const getUsers = (req, res) => {
  return User.find({}).then((users) => {
    return res.status(200).send(users);
  })
  .catch ((err) => {
    return res.status(400).send({"message": "Пользователи не создены"});

  });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId).then((user) => {
    return res.status(200).send(user);
  })
  .catch ((err) => {
    return res.status(400).send({"message": "Пользователь не найден"});

  });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData).then((newUser) => {
    return res.status(201).send(newUser);
  })
  .catch ((err) => {
    return res.status(400).send({"message": "Пользователь не создан"});

  });
};




const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }).then(
    (updateUser) => {
      return res.status(200).send(updateUser);
    }
  )
  .catch ((err) => {
    return res.status(400).send({"message": "Пользователь не обновлен"});

  });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, {new: true}).then(
    (updateAvatar) => {
      return res.status(200).send(updateAvatar);
    }
  )
  .catch ((err) => {
    return res.status(400).send({"message": "Аватар не обновлен"});

  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
