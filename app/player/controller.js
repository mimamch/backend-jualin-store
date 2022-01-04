const Player = require('./model')
const Category = require('../category/model')
const Voucher = require('../voucher/model')
const Nominal = require('../nominal/model')
const Payment = require('../payment/model')
const Bank = require('../bank/model')
const Transaction = require('../transaction/model')

const path = require('path')
const fs = require('fs')
const config  = require('../../config')

module.exports={
    landingPage: async(req, res)=>{
        try {
            const voucher = await Voucher.find()
            .select('_id nama status category thumbnail')
            .populate('category')
            res.status(200).json({data: voucher})
        } catch (error) {
            res.status(500).json({message: error.message || `SERVER ERROR`})
        }
    },
    detailPage: async(req, res)=>{
        try {
        const {id} = req.params
            const voucher = await Voucher.findOne({ _id: id})
            .populate('category').populate('nominals').populate('user', '_id nama phoneNumber')
            
            if (!voucher) {
                return res.status(404).json({message: 'Voucher tidak ditemukan!'})
            }
            
            res.status(200).json({data: voucher})

        } catch (error) {
            res.status(500).json({message: error.message || `SERVER ERROR`})
        }
    },
    category: async(req,res)=>{
        try {
            const category = await Category.find()
            res.status(200).json({data: category})
        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})

        }
    },
    checkout: async(req, res, next)=>{
        try {
            const {accountUser, nama, nominal, voucher, payment, bank} = req.body

            const res_voucher = await Voucher.findOne({_id: voucher}).
            select('nama category _id thumbnail user')
            .populate('category').populate('user')

            if(!res_voucher){
                return res.status(404).json({ message: `Voucher game tidak ditemukan`})
            }

            const res_nominal = await Nominal.findOne({_id: nominal})
            if(!res_nominal){
                return res.status(404).json({ message: `Nominal game tidak ditemukan`})
            }

            const res_payment = await Payment.findOne({_id: payment})
            if(!res_payment){
                return res.status(404).json({ message: `Pembayaran game tidak ditemukan`})
            }

            const res_bank = await Bank.findOne({_id: bank})
            if(!res_bank){
                return res.status(404).json({ message: `Bank tidak ditemukan`})
            }
            let tax = (10/100) * res_nominal._doc.price
            let value = res_nominal._doc.price - tax
            const payload = {
                historyVoucherTopup: {
                    gameName: res_voucher._doc.nama,
                    category: res_voucher._doc.category ? res_voucher._doc.category.nama : '',
                    thumbnail:  res_voucher._doc.thumbnail,
                    coinName:  res_nominal._doc.coinName,
                    coinQuantity: res_nominal._doc.coinQuantity,
                    price: res_nominal._doc.price,
                },
                historyPayment: {
                    nama: res_bank._doc.namaPemilik,
                    type: res_payment._doc.tipe,
                    bankName: res_bank._doc.namaBank,
                    noRekening: res_bank._doc.noRekening,
                },
                nama: nama,
                accountUser: accountUser,
                tax: tax,
                value: value,
                player: req.player._id,
                historyUser: {
                    nama: res_voucher._doc.user?.nama,
                    phoneNumber: res_voucher._doc.user?.phoneNumber
                    },
                category: res_voucher._doc.category?._id,

                user: res_voucher._doc.user?._id
            }
            
            const transaction = new Transaction(payload)
            await transaction.save()

            res.status(201).json({
                data: transaction
            })
            
        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})
        }
    },
    history: async(req,res) =>{
        try {
            const {status = ''} = req.query

            let criteria = {}

            if (status.length) {
                criteria = {
                    ...criteria,
                    status: {$regex: `${status}`, $options: `i`}
                }
            }

            if (req.player._id) {
                criteria = {
                    ...criteria,
                    player: req.player._id
                }
            }

            const history = await Transaction.find(criteria)

            let total = await Transaction.aggregate([
                {$match: criteria},
                {
                    $group: {
                        _id: null,
                        value: {$sum: "$value"}
                    }
                }
            ])

            res.status(200).json({
                total: total.length ? total[0].value : 0,
                data: history
            })
            
        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})
        }
    },
    historyDetail: async(req, res)=>{
        try {
            const {id} = req.params
            const history = await Transaction.findOne({_id: id})

            if (!history) {
                return res.status(404).json({
                    message: `history tidak ditemukan`
                })
            }

            res.status(200).json({
                data: history
            })

        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})
        }
    },
    dashboard: async(req,res)=>{
        try {
            const count = await Transaction.aggregate([
                { $match: {player: req.player._id}},
                {
                    $group: {_id: '$category', value: {$sum: '$value'}}
                }
            ])

            const category = await Category.find()
            category.forEach(element => {
                count.forEach(data =>{
                    if (data._id.toString() == element._id.toString()) {
                        data.nama = element.nama
                    }
                })
            });

            const history = await Transaction.find({player: req.player._id})
            .populate('category')
            .sort({'updatedAt' : -1})

            res.status(200).json({
                data: history, count
            })
        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})
        }
    },
    profile: async(req,res)=>{
        try {

            const player = {
                id: req.player.id,
                email: req.player.email,
                phoneNumber: req.player.phoneNumber,
                avatar: req.player.avatar,
                nama: req.player.nama,
                username: req.player.username
            }

            res.status(200).json({
                data: player
            })
            
        } catch (error) {
            res.status(500).json({message: `INTERNAL SERVER ERROR`})
        }
    },
    editProfile: async(req, res, next)=>{
        try {
            const {nama = '', phoneNumber = ''} = req.body

            
            payload = {}
            
            if (nama.length) payload.nama = nama
            if (phoneNumber.length) payload.phoneNumber = phoneNumber
            
            if (req.file) {
                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt

                let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)

                let src = fs.createReadStream(tmp_path)
                let dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async ()=>{
                 
                        let player = await Player.findOne({_id: req.player.id})

                        let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        player = await Player.findByIdAndUpdate({_id: req.player.id}, {
                            ...payload, 
                            avatar: filename,
                            
                            
                        },{new: true, runValidators: true})
                    res.status(201).json({
                        data: {
                            id: player.id,
                            nama: player.nama,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar,
                        }
                    })
                })
                src.on('err', async()=>{
                    next(err)
                })
            }else{
                const player = await Player.findOneAndUpdate({
                    _id: req.player.id
                }, payload, {new: true, runValidators: true})

                res.status(201).json({
                    data: {
                        id: player.id,
                        nama: player.nama,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    }
                })
            }
        } catch (error) {
            if (error && error.name === "ValidationError") {
                res.status(422).json({
                    message: error.message,
                    fields: error.errors
                })
                
            }
            res.status(422).json({
                message: error.message,
                fields: error.errors
            })
        }
    }
}