const mongoose = require('mongoose');

const crudschema = mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    status:String,
})

const shareschema = mongoose.model("data", crudschema);

 module.exports = shareschema;