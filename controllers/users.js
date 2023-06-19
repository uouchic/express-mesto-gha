const User = require("../models/user");

const getUsers = (req, res) => {
  return User.find({}).then((users) => {
    return res.status(200).send(users);
  });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById(userId).then((user) => {
    return res.status(200).send(user);
  });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData).then((newUser) => {
    return res.status(201).send(newUser);
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }).then(
    (updateUser) => {
      return res.status(201).send(updateUser);
    }
  );
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }).then(
    (updateAvatar) => {
      return res.status(201).send(updateAvatar);
    }
  );
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
