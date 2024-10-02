var express = require('express');
var router = express.Router();
var model_semester = require('../model/model_semester')
var model_prodi = require('../model/model_prodi')
var model_kelas = require('../model/model_kelas')
var model_matakuliah = require('../model/model_matakuliah')
var model_jadwal = require('../model/model_jadwal')


router.get('/create/semester', async (req, res, next)=>{
    let rows = await model_semester.getAll()
    res.render('',{
        data : rows
    })
})

router.post('/post/semester', async ()=>{
    let semester = req.body
    let Data = {semester}
    await model_semester.store(Data)
    req.flash('success', 'berhasil memasukan data')
})

router.get('/create/prodi', async (req, res, next)=>{
    let rows = await model_prodi.getAll()
    res.render('',{
        data : rows
    })
})

router.post('/post/prodi', async ()=>{
    let {prodi, id_semester} = req.body
    let Data = {prodi, id_semester}
    await model_semester.store(Data)
    req.flash('success', 'berhasil memasukan data')
})

router.get('/create/kelas', async (req, res, next)=>{
    let rows = await model_kelas.getAll()
    res.render('',{
        data : rows
    })
})

router.post('/post/kelas', async ()=>{
    let {nama_kelas, id_prodi} = req.body
    let Data = {nama_kelas, id_prodi}
    await model_kelas.store(Data)
    req.flash('success', 'berhasil memasukan data')
})

router.get('/create/matakuliah', async (req, res, next)=>{
    let rows = await model_matakuliah.getAll()
    res.render('',{
        data : rows
    })
})

router.post('/post/matakuliah', async ()=>{
    let {nama_mata_kuliah, id_kelas} = req.body
    let Data = {nama_mata_kuliah, id_kelas}
    await model_matakuliah.store(Data)
    req.flash('success', 'berhasil memasukan data')
})

router.get('/create/jadwal', async (req, res, next)=>{
    let rows = await model_jadwal.getAll()
    res.render('',{
        data : rows
    })
})

router.post('/post/jadwal', async ()=>{
    let {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas} = req.body
    let Data = {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas}
    await model_matakuliah.store(Data)
    req.flash('success', 'berhasil memasukan data')
})

module.exports = router