const mongoose = require('mongoose')

let voucherSchema = mongoose.Schema({
    
    nama: {
        type: String,
        require: [true, 'Nama Game harus di isi']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    nominals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nominal'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, {timestamps: true})

module.exports = mongoose.model('Voucher', voucherSchema)