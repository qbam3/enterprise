var express = require('express');
var router = express.Router();
let model_semester = ('../model/model_semester');
let model_prodi = ('../model/model_prodi');
let model_kelas = ('../model/model_kelas');
let model_matakuliah = ('../model/model_matakuliah');

router.post('/semester/create', async (req, res, next)=>{
    let {semester} = req.body
    let Data = semester
    await model_semester.store(Data)
})

router.post('/prodi/create', async (req, res, next)=>{
    let {prodi, id_semester} = req.body
    let Data = {prodi, id_semester}
    await model_prodi.store(Data)
})

router.post('/kelas/create', async (req, res, next)=>{
    let {kelas, id_prodi} = req.body
    let Data = {kelas, id_prodi}
    await model_kelas.store(Data)
})

router.post('/create', async (req, res, next)=>{
    let {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas} = req.body
    let Data = {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas}
    await model_matakuliah.store(Data);
})




module.exports = router;