var express = require('express');
var router = express.Router();
var model_absensi = require('../model/model_absensi')

router.post('/', async (req, res, next)=>{
    let {pertemuan, id_jadwal} = req.body
    if(pertemuan < 0){
        return pertemuan++;
    }
    if(pertemuan >= 16){
        return "Anda sudah memenuhi batas pertemuan";
    }
    let Data = {pertemuan,id_jadwal}
    await model_absensi.store(Data)

})
module.exports = router;
