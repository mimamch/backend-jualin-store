const mongoose = require('mongoose')

let bankScema = mongoose.Schema({
    
    namaPemilik: {
        type: String,
        require: [true, 'Nama Pemilik Bank harus di isi']
    },
    namaBank: {
        type: String,
        require: [true, 'Nama Bank harus di isi']
    }
    ,
    noRekening: {
        type: String,
        require: [true, 'Nomor Rekening Bank harus di isi']
    }
}, {timestamps: true})

module.exports = mongoose.model('Bank', bankScema)