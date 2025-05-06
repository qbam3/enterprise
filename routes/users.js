var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')
var model_mahasiswa = require('../model/model_mahasiswa')
var model_dosen = require('../model/model_dosen')


router.get('/', async (req, res, next)=> {
    
    if(!req.session.userId){
        req.flash('warning', 'anda harus login')
        return res.redirect('/login')
    }
    let id = req.session.userId
    let Data = await model_users.getId(id)

    console.log(Data)

   if(Data.length > 0){
    if(Data[0].role === '3'){
        let dataMahasiswa = await model_mahasiswa.getIdUsers(id);
        console.log(dataMahasiswa)
        if(dataMahasiswa[0].id_users === Data[0].id_users){
            res.redirect(`/mahasiswa/${dataMahasiswa[0].id_mahasiswa}`)
        }
    }

    if(Data[0].role === '2'){
        let dataDosen = await model_dosen.getIdUsers(id);
        console.log(dataDosen)
        if(Data[0].id_users === dataDosen[0].id_users){
            res.redirect(`/dosen/${dataDosen[0].id_dosen}`)
        }
    }

    if(Data[0].role === '1'){
        res.redirect(`/admin/${Data[0].id_users}`)
    } 
   }
});

module.exports = router;
