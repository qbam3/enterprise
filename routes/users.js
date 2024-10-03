var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')


router.get('/', async (req, res, next)=> {
   let id = req.session.userId
   let Data = await model_users.getId(id)
   
   if(!req.session.userId){
    req.flash('warning', 'anda harus login')
    return res.redirect('/login')
   }

   if(Data.length > 0){
    if(Data[0].role === '3'){
        res.redirect('/mahasiswa')
    }

    if(Data[0].role === '2'){
        res.redirect('/dosen')
    }

    if(Data[0].role === '1'){
        res.redirect('/admin')
    } 
   }
});

module.exports = router;
