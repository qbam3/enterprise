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
        res.render('users/index', {
            username: Data[0].username
        })
    }

    if(Data[0].role === '2'){
        res.render('dosen/index', {
            username: Data[0].username
        })
    }

    if(Data[0].role === '1'){
        res.render('admin/index', {
            username: Data[0].username
        })
    } 
   }
});

module.exports = router;
