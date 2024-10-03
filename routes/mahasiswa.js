var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')
var router = express.Router();

function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
        req.flash('error', 'Silakan login untuk mengakses halaman produk');
        return res.redirect('/login');
    }
    next();
  }

router.get('/', isAuthenticated, async (req, res, next)=>{
    let Data = await model_users.getAll();
    res.render('users/index', {
        Username: Data[0].username
    })
})
router.get('/matakuliah', function(req, res, next) {
    res.render('matakuliah/index');
  });

  router.get('/matakuliah/detail', function(req, res, next) {
    res.render('matakuliah/detail');
  });

router.get('/absensi', async (req, res, next)=>{
    await model_absensi.getAll();
    res.render('absensi/index')
})
module.exports = router;
