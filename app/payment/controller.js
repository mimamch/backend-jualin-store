const Payment = require('./model')
const Bank = require('../bank/model')
let title = 'payment'

module.exports ={
    index: async(req, res) =>{
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const payment = await Payment.find().populate('banks')

        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/payment/view_payment", { payment , alert, nama: req.session.user.nama,
                title: 'Metode Pembayaran'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    viewCreate: async(req, res)=>{
        const bank = await Bank.find()
        try {
            res.render('admin/payment/create', {bank, nama: req.session.user.nama,
                title: 'Tambah Metode Pembayaran'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    actionCreate: async(req, res)=>{
        try {
            const {tipe, banks} = req.body
            
            let payment = await Payment({tipe, banks})
            await payment.save()
            req.flash('alertMessage', 'Berhasil Ditambahkan')
            req.flash('alertStatus', 'success')
            res.redirect(`/${title}`)
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    actionStatus: async(req, res) =>{
        try {
            const {id} = req.params
            let paymentStatus = await Payment.findById(id)
            if(paymentStatus.status == 'Y'){
                await Payment.findByIdAndUpdate(id, {status: 'N'})
            }else{
                await Payment.findByIdAndUpdate(id, {status: 'Y'})
            }
            res.redirect('/payment')
        } catch (error) {
            
        }
    },
    viewEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const bank = await Bank.find()
            const payment = await Payment.findOne({_id: id}).populate('banks')
            res.render('admin/payment/edit', {payment, bank, nama: req.session.user.nama,
                title: 'Ubah Metode Pembayaran'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    
    actionEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const {tipe, banks} = req.body
            await Payment.findOneAndUpdate({_id: id},{tipe, banks})
            req.flash('alertMessage', 'Berhasil Diubah')
            req.flash('alertStatus', 'success')
            res.redirect(`/${title}`)
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    actionDelete: async(req, res)=>{
        try {
            const {id} = req.params
            await Payment.findOneAndDelete({_id: id})
            req.flash('alertMessage', 'Berhasil Dihapus')
            req.flash('alertStatus', 'success')
            res.redirect(`/${title}`)
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    }

}