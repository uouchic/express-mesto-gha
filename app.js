const express = require("express");
const bodyParser = require("body-parser");
const userRouters = require("./routes/users");
const cardRouters = require("./routes/cards");
const mongoose = require("mongoose");

const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Мы подключились к базе данных");
  });

const app = express();

app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  res.send("Привет мир!");
});

app.use((req, res, next) => {
  req.user = {
    _id: "648f3229f1be55f3c7c3b7be", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRouters);
app.use(cardRouters);



app.all('*', function(req, res){
  res.status(404).send({ message: "Страница не найдена" });

});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`Сервер запущен на порту ${PORT}`);
});
