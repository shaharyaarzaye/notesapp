const mongoose = require('mongoose');
const Note = require('./notes');

const userSchema = mongoose.Schema( { 
    Email: String ,
    Username : String , 
    Password:String , 
    Age : Number,
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Note'
        }
        
    ]
});


const User = mongoose.model('User' , userSchema);


module.exports = User;
