const Nominal = require('./model')

module.exports ={
    index: async(req, res) =>{
        const nominal = await Nominal.find()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')

        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/nominal/view_nominal", { nominal , alert , nama: req.session.user.nama,
                title: 'Nominal'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    viewCreate: async(req, res)=>{
        try {
            res.render('admin/nominal/create',{ nama: req.session.user.nama,
                title: 'Tambah Nominal'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionCreate: async(req, res)=>{
        try {
            const {quantity, nama, price} = req.body

            let nominal = await Nominal({coinQuantity: quantity, coinName: nama, price})
            await nominal.save()
            req.flash('alertMessage', 'Berhasil Ditambahkan')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    viewEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const nominal = await Nominal.findOne({_id: id})
            res.render('admin/nominal/edit', {nominal, nama: req.session.user.nama,
                title: 'Ubah Nominal'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    
    actionEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const {nama, quantity, price} = req.body
            let nominal = await Nominal.findOneAndUpdate({_id: id}, {coinQuantity: quantity, coinName: nama, price})
            req.flash('alertMessage', 'Berhasil Diubah')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    actionDelete: async(req, res)=>{
        try {
            const {id} = req.params
            await Nominal.findOneAndDelete({_id: id})
            req.flash('alertMessage', 'Berhasil Dihapus')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    }

}