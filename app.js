const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const Notes = require('./models/notes');
const User = require('./models/user');
const req = require('express/lib/request');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');




app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "public")));
app.use(cookieParser());


//Auth Routes

app.get('/signup' , (req , res) =>{
    res.render('signup');
})

app.post('/signup' , async (req, res) =>{
    const {Email , Username , Password , Age} = req.body;
    const OldUser = await  User.findOne({Email : Email});
    if(OldUser){
        res.send("User Already Exist");
    }
    else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(Password, salt, function(err, hash) {
                console.log(hash);
                const newUser =  new User({
                    Email :Email,
                    Username : Username, 
                    Password : hash,
                    Age: Age,
                })
                newUser.save();
                
            });
        });
        res.render('login');
        let token = jwt.sign({email: Email , userid : newUser._id} , "Shhhh")
        res.cookie('token' , token);
        
    }
    
})

app.get('/' , (req , res) =>{
    res.render('login');
})

app.post('/login' ,async (req , res) =>{
    const {Email , Password} = req.body;
    const getUser = await User.findOne({Email});
    console.log(getUser);
        if(getUser){
            bcrypt.compare(Password, getUser.Password, function(err, result) {
                if(!result){
                res.send('wrong Password');
               }
               else{
                    let token =  jwt.sign({Email : Email , userid : getUser._id } , "Shhhh");
                    res.cookie("token" , token);
                    console.log("working")
                    res.redirect('/mynotes');
               }
               
            })
        }
    
    });

app.get('/logout' , (req , res) => {
        res.cookie("token" , "");
        res.redirect('/');
    })
   

 function isLoggedIn(req , res , next){
        // console.log(req.cookies);
        if(req.cookies.token === "") res.send('you must be logged in')
        else{
            let data = jwt.verify(req.cookies.token , "Shhhh")
            // console.log(data);
            console.log("working fine")
    
        }
        next();
    }




//view Routes

app.get('/mynotes', isLoggedIn , async(req , res) =>{
    // console.log('user is ' , req.user);
    const allNotes = await Notes.find();
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


//middlewares





app.listen(3000, console.log("Server ON......"));