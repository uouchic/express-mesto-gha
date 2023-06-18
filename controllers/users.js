//const userData = require("../data.json");

const User = require('../models/user')

const getUsers = (req, res) => {
  return User.find({})
  .then((users) => {
    return res.status(200).send(users);
  })


  // res.status(200);
  // res.send(userData);
};






const getUserById = (req, res) => {
  const { userId } = req.params;


  return User.findById(userId)
  .then((user) => {

    return res.status(200).send(user);



  })


  // res.status(200);
  // res.send(userData.find((user) => user.id == userId));
  //res.send(userData[userId]);
};







const createUser = (req, res) => {

  const newUserData = req.body;

  return User.create(newUserData)
  .then((newUser) => {

    return res.status(201).send(newUser);



  })





  // res.status(201);
  // res.send("Новый прользователь создан");
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
