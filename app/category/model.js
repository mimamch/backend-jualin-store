const mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
    nama : {
        type: String,
        require: [true, 'Nama Kategori Harus Di isi']
    }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)