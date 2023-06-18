const mongoose = require('mongoose');


const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    nminlength: 2,
    maxlength: 30
  },

  link: {
    type: ObjectId,
    required: true,
  }



});


module.exports = mongoose.model('card', cardSchema);