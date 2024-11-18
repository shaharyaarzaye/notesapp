const mongoose = require('mongoose');

const userSchema = mongoose.Schema( { Email: String , Username : String , Password:String , Age : Number  });


const User = mongoose.model('User' , userSchema);


module.exports = User;
