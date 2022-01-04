const Player = require('../player/model')
const Category = require('../category/model')
const path = require('path')
const fs = require('fs')
const  config  = require('../../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports={
    signup: async(req,res, next)=>{
        try {
            const payload = req.body

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
                        let player = new Player({...payload, avatar: filename
                        })
                        
                        await player.save()

                        delete player._doc.password

                        res.status(201).json({data: player})
                        
                    } catch (error) {
                        if(error && error.name === "ValidationError"){
                            res.status(422).json({message: error.message, fields: error.errors, error: 1})
                        }
                    }
                })

            }else{
                let player = new Player(payload)
                await player.save()
                delete player._doc.password

                res.status(201).json({data: player})
            }


            

        } catch (error) {
            if(error && error.name === "ValidationError"){
                res.status(422).json({message: error.message, fields: error.errors, error: 1})
            }else{
                res.status(500).json({message: `INTERNAL SERVER ERROR`})

            }
            // console.log(error)
            // console.log(error.name)
            // res.status(422).json({message: error.message, fields: error.error, error: 1})
        }
    },
    signin: async(req, res, next) =>{
        const {email, password} = req.body

        Player.findOne({email}).then(player =>{

            if(player){
                const checkPass = bcrypt.compareSync(password, player.password)
                if(checkPass){
                    const token = jwt.sign({
                        player: {
                            id: player.id,
                            username: player.username,
                            email: player.email,
                            nama: player.nama,
                            phoneNumber: player.phoneNumber,
                            avatar: player.avatar
                        }
                    },
                    config.jwtKey)
                    res.status(200).json({
                        data: {token}
                    })


                }else{
                    res.status(403).json({ message: `Password Salah`})
                }
            }else{
                res.status(403).json({ message: `EMAIL YANG ANDA MASUKKAN TIDAK TERDAFTAR`})
            }

        }).catch((error)=>{
            res.status(500).json({ message: error.message || `INTERNAL SERVER ERROR`})
            next()
        })
    }
    
}