const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

dotenv.config({path:'config.env'})
const port  = process.env.PORT || 8080;

const app = express();

const getschema = require('./server/model/model')
require("./server/database/conn");
//log requist
app.use(morgan('tiny'));


//parser 
app.use(bodyparser.urlencoded({extended:true}));

//set view engin
app.set("view engine", "ejs");

//load assets 
app.use('/css/style.css', express.static(path.resolve(__dirname, '/assest/css')) );
app.use('/img', express.static(path.resolve(__dirname, 'assest/img')) );
app.use('/js', express.static(path.resolve(__dirname, 'assest/js')) );


app.get("/", (req,res) => {

    axios.get('http://localhost:8080/api/user')
    .then(function(response) {
        console.log(response);
        res.render('index', {user:response.data});
    }).catch(err => {
        res.send(err);
    })
});


app.get("/add_user", (req,res) => {
    res.render('add_user');
});

app.get("/update_user", (req,res) => {

    axios.get('http://localhost:8080/api/user', { params : { id : req.query.id }})
    .then(function(userdata){
        res.render("update_user", { use : userdata.data})
    })
    .catch(err =>{
        res.send(err);
    })

   
});












//api

app.post('/api/user', (req,res) => {

    const user = new getschema ({
        name : req.body.name,
        email : req.body.email,
        gender : req.body.gender,
        status : req.body.status,

    })
    user
    .save(user).then(data => {
         res.redirect('/add_user')
    }).catch(err =>{
        res.send(err);
    })
})

app.get('/api/user', (req,res) => {

    if (req.query.id) {
        const id = req.query.id;

        getschema.findById(id).then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
    } else {
        
        getschema.find().then(data=> {
            res.send(data)
        }).catch(err => {
            res.send(err);
        });
        
    }

})

app.put('/api/user/:id', (req,res) => {
    if(!req.body){
        return res
        .send('bismillahir rahmani rahim');
    }
    
    const id = req.params.id;
    getschema.findByIdAndUpdate(id, req.body,{ useFindAndModify:false})
    .then(data => {
        if (!data) {
            res.send("please enter valid id")
        } else {
            res.send(data)
        }
    }).catch(err => {
        res.send(err);
    })
})

app.delete('/api/user/:id', (req,res) => {
    
    
    const id = req.params.id;
    getschema.findByIdAndDelete(id)
    .then(data => {
        if (!data) {
            res.send("please enter valid id")
        } else {
            res.send(data)
        }
    }).catch(err => {
        res.send(err);
    })

})



















app.listen(port, () => {
    console.log("success");
})