const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true

    },
    author:{
        type:String,
        required:true,

    },
    description:{
        type:String
    },
    category:{
        type:String,
        require:true
    },
    fileUrl:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, { timestamps: true })

const bookModel = mongoose.model('Book',bookSchema)
module.exports = bookModel