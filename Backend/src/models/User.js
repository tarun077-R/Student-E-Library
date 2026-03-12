const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required:true

    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
     savedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema)
module.exports = userModel