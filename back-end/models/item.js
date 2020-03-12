// Yanas code

const mongoose = require('mongoose');  // since we are using Moongoose we have to require it

const itemSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username : String,
  description : String,
  image : String
});
// For it to be used
module.exports = mongoose.model('Item', itemSchema);

// end of Yanas code
