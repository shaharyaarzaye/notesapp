const mongoose = require('mongoose');

const noteSchema = mongoose.Schema( { 
    filename: String ,
    content : String ,
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } , 
    date : {
        type : Date , 
        default : Date.now
    }
});


const Note = mongoose.model('Note' , noteSchema);


module.exports = Note;