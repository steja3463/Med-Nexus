const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required:true
  },
  roles: {
    isAdmin : {type:Boolean,default:false},
    isPatient : {type:Boolean,default:true},
    isDoctor : {type:Boolean,default:false}
  }

});

module.exports = mongoose.model('User',UserSchema);
