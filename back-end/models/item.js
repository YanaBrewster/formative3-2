// Yanas code
// Natalia added member_id reference
const mongoose = require('mongoose');  // since we are using Moongoose we have to require it

const itemSchema = new mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  username : String,
  title : String,
  description : String,
  image : String,
  memberId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Member'
  }
});
// For it to be used
module.exports = mongoose.model('Item', itemSchema);

// end of Yanas code
