const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const userRouters = require('./routes/users');
const cardRouters = require('./routes/cards');

const { auth } = require('./middlewares/auth');

const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
  });

const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '648f3229f1be55f3c7c3b7be',
//   };

//   next();
// });

app.post('/signin', login);


app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().min(2).uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(errors());

app.use(auth);

app.use(userRouters);
app.use(cardRouters);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
});
