const Category = require('./model')

module.exports ={
    index: async(req, res) =>{
        const category = await Category.find()
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')

        const alert = {message: alertMessage, status: alertStatus}
        try {
            res.render("admin/category/view_category", { category , alert , nama: req.session.user.nama,
                title: 'Kategori'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewCreate: async(req, res)=>{
        try {
            res.render('admin/category/create', {nama: req.session.user.nama,
                title: 'Tambah Kategori'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionCreate: async(req, res)=>{
        try {
            const {nama} = req.body

            let category = await Category({nama})
            await category.save()
            req.flash('alertMessage', 'Berhasil Ditambahkan')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    viewEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const category = await Category.findOne({_id: id})
            res.render('admin/category/edit', {category , nama: req.session.user.nama,
                title: 'Ubah Kategori'})
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    
    actionEdit: async(req, res) =>{
        try {
            const {id} = req.params
            const {nama} = req.body
            let category = await Category.findOneAndUpdate({_id: id}, {nama})
            req.flash('alertMessage', 'Berhasil Diubah')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    actionDelete: async(req, res)=>{
        try {
            const {id} = req.params
            let category = await Category.findOneAndDelete({_id: id})
            req.flash('alertMessage', 'Berhasil Dihapus')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    }

}