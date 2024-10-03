var express = require('express');
var router = express.Router();
var model_users = require('../model/model_users')
var model_absensi = require('../model/model_absensi')


router.get('/', async (req, res, next)=>{
    let Data = await model_users.getAll();
    res.render('dosen/index', {
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



router.post('/postAbsent', async (req, res, next)=>{
    let id_jadwal = req.session.userId
    let {pertemuan} = req.body
    if(pertemuan < 0){
        pertemuan++;
        if(pertemuan >= 16){
           req.flash('error', 'Jumlah pertemuan hingga 16')
        }
        let Data = {pertemuan,id_jadwal}
        await model_absensi.store(Data)
    }

})
module.exports = router;
