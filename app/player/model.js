const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
    
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
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    
    phoneNumber: {
        type: String,
        require: [true, 'No Hp harus di isi']
    },
    avatar: {
        type: String
    },
    filename: {type: String},
    username: {
        type: String,
        require: [true, 'Username harus di isi']
    },
    favorite:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {timestamps: true})

playerSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('Player').countDocuments({email: value})
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`)

playerSchema.pre('save', async function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})


module.exports = mongoose.model('Player', playerSchema)