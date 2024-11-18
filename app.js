const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const Notes = require('./models/notes');
const User = require('./models/user');
const req = require('express/lib/request');



app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "public")));


//Auth Routes

app.get('/signup' , (req , res) =>{
    res.render('signup');
})

app.post('/signup' , async (req, res) =>{
    const {Email , Username , Password , Age} = req.body;
    console.log(req.body)
    const OldUser = await  User.findOne({Email : Email});
    if(OldUser){
        res.send("User Already Exist");
    }
    else{
        const newUser =  new User({
            Email :Email,
            Username : Username, 
            Password : Password,
            Age: Age,
        })
        newUser.save();
    }
    res.render('login');
    
})

app.get('/login' , (req , res) =>{
    res.render('login');
})

app.post('/login' , (req , res) =>{
    const {Email , Password} = req.body;
    const getUser = User.findOne({Email : Email , Password : Password});
    if(getUser){
        res.redirect('/');
    }
    else{
        res.send("Something Went Wrong");
    }
})




//view Routes

app.get('/' , async(req , res) =>{
    const allNotes = await Notes.find();
    console.log(allNotes);
    res.render('home' , {allNotes})
});

app.get('/view/:filename' , async(req , res) => {
    const {filename} = req.params;
    const  note = await Notes.findOne({filename : filename});
    res.render('view' , {note});
})

//Create Routes

app.get('/create' , (req , res) =>{
    res.render('create');
})

app.post('/create' , async(req , res) => {
    console.log(req.body);
    const {filename , content } = req.body;
        const newNote =  new Notes({
            filename : filename,
            content : content
        })

       await newNote.save();
    res.redirect('/')
})


// Edit Routes

app.get('/edit/:filename' , async (req , res)=>{
    const { filename } = req.params;
    // Find the document using the filename
    const note = await Notes.findOne({ filename : filename });
    if (!note) {
        return res.status(404).send('Note not found');
    }

    res.render('edit', {filename , content : note.content})
})
app.post('/edit/:filename' , async (req , res) =>{
    const {filename} = req.params
    console.log("request to change the notes of ",filename , "things to change" , req.body);
    const {newName , newContent} = req.body;
    const newNote = await Notes.findOneAndUpdate({filename : filename} , {filename : newName , content : newContent});
    res.redirect('/');
    
})


// Delete Routes

app.get('/delete/:filename' , async(req , res) => {
    console.log(req.params);
    const {filename} = req.params;
    console.log(filename);
    await Notes.findOneAndDelete({filename : filename});
    res.redirect('/')
})








app.listen(3000, console.log("Server ON......"));