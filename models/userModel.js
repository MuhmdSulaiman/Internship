const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    f_name: {
        type: String,
        required: [true, 'Name is required'],
    },
    f_email: {
        type: String,
        required: [true, 'Email is required']
    },
    f_Mobile: {
        type: String,
        required: [true, ' Mobile number is required'],
        min: [10, 'invalid number']
    },
    f_Designation:{
      type:String,
      required:[true,'Designation is required']
    },
    f_gender:{
      type:String,
      required:[true,'gender is required']
    },
    f_course:{
      type:Array,
      required:[true,'course is required']
    },
     f_createdate:{
      type:Date,
      required:[true,'date is required']
      
    },
    f_image:{
      type:String,
      required:[true,'Image is required']
    }
    
   
    
});

const user = mongoose.model('User', UserSchema);

module.exports = user;

