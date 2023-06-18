const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

//возвращает всех пользователей
router.get("/users", getUsers);

//возвращает пользователя по _id
router.get("/users/:userId", getUserById);

//создаёт пользователя
router.post("/users", createUser);

module.exports = router;
