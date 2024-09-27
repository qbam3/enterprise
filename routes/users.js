var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')


/* GET users listing. */
router.get('/', async (req, res, next)=> {
   let id = req.session.userId
   let Data = await model_users.getId(id)
    console.log(Data);
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
    
   }else{
    req.flash('Ada yang salah');
   }
});

module.exports = router;
