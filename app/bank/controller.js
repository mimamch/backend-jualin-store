const Bank = require('./model')

module.exports ={
    index: async(req, res) =>{
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')
        const bank = await Bank.find()

        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/bank/view_bank", { bank , alert , nama: req.session.user.nama,
                title: 'Bank'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewCreate: async(req, res)=>{
        try {
            res.render('admin/bank/create',{ nama: req.session.user.nama,
                title: 'Buat Bank'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionCreate: async(req, res)=>{
        try {
            const {namaPemilik, namaBank, noRekening} = req.body

            let bank = await Bank({namaPemilik, namaBank, noRekening})
            await bank.save()
            req.flash('alertMessage', 'Berhasil Ditambahkan')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    viewEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const bank = await Bank.findOne({_id: id})
            res.render('admin/bank/edit', {bank, nama: req.session.user.nama,
                title: 'Ubah Bank'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    
    actionEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const {namaPemilik, namaBank, noRekening} = req.body
            await Bank.findOneAndUpdate({_id: id},{namaPemilik, namaBank, noRekening})
            req.flash('alertMessage', 'Berhasil Diubah')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    actionDelete: async(req, res)=>{
        try {
            const {id} = req.params
            await Bank.findOneAndDelete({_id: id})
            req.flash('alertMessage', 'Berhasil Dihapus')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    }

}