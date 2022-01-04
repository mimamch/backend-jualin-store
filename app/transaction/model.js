const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema({
    historyVoucherTopup:{
        gameName: {type: String, require: [true, 'Nama Game Harus di isi']},
        category: {type: String, require: [true, 'Kategori Harus di isi'] },
        thumbnail: {type: String },
        coinName: {type: String, require: [true, 'Nama Koin Harus di isi'] },
        coinQuantity: {type: String, require: [true, 'Jumlah Koin Harus di isi'] },
        price: {type: Number },
    },
    historyPayment: {
        nama: { type: String, require: [true, 'Nama Harus di isi']},
        type: { type: String, require: [true, 'Tipe Harus di isi']},
        bankName: { type: String, require: [true, 'Nama Bank Harus di isi']},
        noRekening: { type: String, require: [true, 'Nomor Rekening Harus di isi']},
    },
    nama: {
        type: String, require:[true, 'Nama Harus diisi'],
        maxLength: [225, "Nama Terlalu Panjang, Max : 225"],
        minLength: [3, "Nama Terlalu Pendek, Min : 3"]
    },
    accountUser: {
        type: String, require:[true, 'Nama Akun Harus diisi'],
        maxLength: [225, "Nama Terlalu Panjang, Max : 225"],
        minLength: [3, "Nama Terlalu Pendek, Min : 3"]
    },
    tax: {
        type: Number,
        default: 0
    },
    value: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    historyUser: {
        nama: {
           type: String, require: [true, 'Nama Player Harus di isi']},
        phoneNumber: {
            type: String,
            require: [true, 'Nomor Telepon Harus diisi']
        }
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
    ,
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

module.exports = mongoose.model('Transaction', transactionSchema)