const mongoose = require('mongoose');


const authSchema = new mongoose.Schema({
  username: {
    type:String,
    required:[true, 'Username field is required']
  },
  password: {
    type:String,
    required:[true, 'Password fields is required'],
    minlength: [6, 'atleast 6 characters required']
  },
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;