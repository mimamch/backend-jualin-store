const User = require('./model')
const bcrypt = require('bcryptjs')
let title = 'user'

module.exports ={
    view_signin: async(req, res) =>{
        const alertMessage = req.flash('alertMessage')
        const alertStatus = req.flash('alertStatus')

        const alert = {message: alertMessage, status: alertStatus}
        
        
        try {
            if(req.session.user === null || req.session.user === undefined){
                res.render("admin/user/view_signin", {alert,
                    title: 'Masuk'})
            }else{
                res.redirect('/dashboard')
            }
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/`)
        }
    },
    actionSignin: async(req, res) =>{
        try {
            const {email, password} = req.body
            const check = await User.findOne({email})
            if (check) {
                if(check.status === 'Y'){
                    
                    const checkPassword = await bcrypt.compare(password, check.password)
                    if (checkPassword) {

                        req.session.user = {
                            id: check.id,
                            email: check.email,
                            status: check.status,
                            nama: check.nama
                        }

                        res.redirect('./dashboard')
                        
                    }else{
                        req.flash('alertMessage', "Password yang anda masukkan salah")
                        req.flash('alertStatus', 'danger')
                        res.redirect(`/`)
                    }
                }else{
                    req.flash('alertMessage', "Email yang anda masukkan tidak aktif")
                    req.flash('alertStatus', 'danger')
                    res.redirect(`/`)
                }
                
            }else{
                req.flash('alertMessage', "Email yang anda masukkan salah")
                req.flash('alertStatus', 'danger')
                res.redirect(`/`)
            }
            
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/`)
        }
    },
    actionLogout: (req, res)=>{
        try {
            req.session.destroy()
            res.redirect('/')
        } catch (error) {
            req.flash('alertMessage', error.message)
            req.flash('alertStatus', 'danger')
            res.redirect(`/`)
        }
    }

}