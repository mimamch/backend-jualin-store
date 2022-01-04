const Transaction = require('./model')
let title = 'transaction'

module.exports ={
    index: async(req, res) =>{
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const transaction = await Transaction.find().populate('player')

        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/transaction/view_transaction", { transaction , alert, nama: req.session.user.nama,
                title: 'Transaksi'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    },
    actionStatus: async (req,res) =>{
        try {
            const {id} = req.params
            const {status} = req.query
            console.log(req.query)
            const transaction = await Transaction.findOneAndUpdate({_id: id}, {status })
            req.flash('alertMessage', 'Berhasil Mengubah Status')
            req.flash('alertStatus', 'success')
            res.redirect(`/${title}`)
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/${title}`)
        }
    }
    

}