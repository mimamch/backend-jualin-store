const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    
    email: {
        type: String,
        require: [true, 'Email harus di isi']
    },
    nama: {
        type: String,
        require: [true, 'nama harus di isi']
    },
    password: {
        type: String,
        require: [true, 'Password harus di isi']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    
    phoneNumber: {
        type: String,
        require: [true, 'No Hp harus di isi']
    }
}, {timestamps: true})


module.exports = mongoose.model('User', userSchema)