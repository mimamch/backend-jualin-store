const Voucher = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const path = require('path')
const fs = require('fs')
const  config  = require('../../config')

module.exports ={
    index: async(req, res) =>{
        const voucher = await Voucher.find().populate('category').populate('nominals')
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        
        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/voucher/view_voucher", { voucher , alert, nama: req.session.user.nama,
                title: 'Voucher'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    viewCreate: async(req, res)=>{
        try {
            const category = await Category.find()
            const nominal = await Nominal.find()
            res.render('admin/voucher/create', {category, nominal, nama: req.session.user.nama,
                title: 'Tambah Voucher'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionCreate: async(req, res)=>{
        try {
            const {category, nama, nominal, } = req.body
            
            if(req.file){
                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)

                let src = fs.createReadStream(tmp_path)
                let dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async ()=>{
                    try {
                        let voucher = new Voucher({
                            category, nama, nominals: nominal, thumbnail: filename
                        })
                        
                        await voucher.save()
                        req.flash('alertMessage', 'Berhasil Ditambahkan')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')
                    } catch (error) {
                        
                    }
                })
            }else{
                // const {category, nama, nominal, price} = req.body
                let voucher = new Voucher({
                    category, nama, nominals: nominal
                })
                // await Voucher({})
                await voucher.save()
                req.flash('alertMessage', 'Berhasil Ditambahkan')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')

            }
            
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionStatus: async(req, res) =>{
        try {
            const {id} = req.params
            let voucherStatus = await Voucher.findById(id)
            if(voucherStatus.status == 'Y'){
                await Voucher.findByIdAndUpdate(id, {status: 'N'})
            }else{
                await Voucher.findByIdAndUpdate(id, {status: 'Y'})
            }
            res.redirect('/voucher')
        } catch (error) {
            
        }
    },
    viewEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const category = await Category.find()
            const nominal = await Nominal.find()
            const voucher = await Voucher.findOne({_id: id}).populate('category').populate('nominals')
            res.render('admin/voucher/edit', {voucher, category, nominal, nama: req.session.user.nama,
                title: 'Ubah Voucher'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionEdit: async(req, res) =>{
        
        try {
            const {category, nama, nominal, } = req.body
            const {id} = req.params
            
            
            if(req.file){
                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let targetPath = path.resolve(config.rootPath, `public/uploads/${filename}`)

                let src = fs.createReadStream(tmp_path)
                let dest = fs.createWriteStream(targetPath)

                src.pipe(dest)

                src.on('end', async ()=>{
                    try {
                        const voucher = await Voucher.findOne({_id:id})

                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`
                        if(fs.existsSync(currentImage)){
                            fs.unlinkSync(currentImage)
                        }

                        await Voucher.findByIdAndUpdate({_id: id}, {
                            category, nama, nominals: nominal, thumbnail: filename
                        })
                        
                        req.flash('alertMessage', 'Berhasil Diubah')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')
                    } catch (error) {
                        req.flash('alertMessage', error.message)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            }else{
                
                // const {category, nama, nominal, price} = req.body
                // console.log(req.body)
                await Voucher.findByIdAndUpdate({_id: id}, {
                    category, nama, nominals: nominal
                })
                req.flash('alertMessage', 'Berhasil Diubah')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher/')

            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    actionDelete: async(req, res)=>{
        try {
            const {id} = req.params
            await Voucher.findOneAndDelete({_id: id})
            req.flash('alertMessage', 'Berhasil Dihapus')
            req.flash('alertStatus', 'success')
            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    }

}