const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname , "public")));


app.get('/' , (req , res) =>{
    fs.readdir("./files" , (err , file)=>{
        res.render('home' , {files: file})
    })
});

app.get('/create' , (req , res) =>{
    res.render('create')
})

app.get('/edit/:filename' , (req , res)=>{
    // console.log(req.params)
    const {filename} = req.params;
    res.render('edit', {filename})
})
app.post('/edit/:filename' , (req , res) =>{
    const {filename} = req.params
    console.log(filename)
    const {newName} = (req.body);
    fs.rename(`./files/${filename}` , `./files/${newName}.txt` , (err)=>{
      if(err){
        console.log(err);
        res.redirect('/');
      }else{
        console.log('name changed');
        res.redirect('/');
      } 
    })
})

app.get('/edit/:filename' , (req , res) =>{
    fs.unlink(`./files/${filename}` , (err)=>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
})

app.post('/create' , (req , res) => {
    fs.writeFile(`./files/${req.body.filename}` , `${req.body.details}` , (err) => {
        console.log(err);
    })
    res.redirect('/')
})








app.listen(3000, console.log("Server ON......"));