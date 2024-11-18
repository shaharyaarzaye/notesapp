const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/notes');

const noteSchema = mongoose.Schema( { filename: String , content : String  });


const Note = mongoose.model('Note' , noteSchema);


module.exports = Note;

