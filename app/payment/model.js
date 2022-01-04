const mongoose = require('mongoose')

let paymentScema = mongoose.Schema({
    
    tipe: {
        type: String,
        require: [true, 'Tipe Pembayaran harus di isi']
    },
    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    }
    ,
    banks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bank'
    }]
}, {timestamps: true})

module.exports = mongoose.model('Payment', paymentScema)