var express = require('express');
var router = express.Router();
var model_semester = require('../model/model_semester')
var model_prodi = require('../model/model_prodi')
var model_kelas = require('../model/model_kelas')
var model_matakuliah = require('../model/model_matakuliah')
var model_jadwal = require('../model/model_jadwal')
var model_users = require('../model/model_users')
var model_dosen = require('../model/model_dosen')
var model_ruangan = require('../model/model_ruangan')


router.get('/submit', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    res.render('admin/submit',{
       DataUsers,
       DataProdi,
       role: DataUsers[0].role
    })
})
router.get('/', async (req, res, next)=>{
    let Data = await model_users.getAll()
    res.render('admin/index',{
        username: Data[0].username,
        email: Data[0].email
    })
})

router.post('/submitAll', async (req, res, next) => {
    try {
        console.log(req.body); 

        let { nama_dosen, jenis_kelamin, agama, semester, prodi, nama_kelas, nama_mata_kuliah, jadwal_kuliah, kelas } = req.body;

        let id_users = req.session.userId; 
        await model_dosen.store({
            nama_dosen,
            jenis_kelamin,
            agama,
            id_users,
        });

        await model_semester.store({
            semester,
        });
        let getSemester = await model_semester.getAll()
        let id_semester = getSemester[0].id_semester;

        await model_prodi.store({
            prodi,
            id_semester,
        });
        let getprodi = await model_prodi.getAll()
        let id_prodi = getprodi[0].id_prodi;

        await model_kelas.store({
            nama_kelas,
            id_prodi,
        });
        let getKelas = await model_kelas.getAll()
        let id_kelas = getKelas[0].id_kelas;

        await model_matakuliah.store({
            nama_mata_kuliah,
            id_kelas,
        });
        let getMatkul = await model_matakuliah.getAll()
        let id_matakuliah = getMatkul[0].id_matakuliah;

        let getDosen = await model_dosen.getAll()
        let id_dosen = getDosen[0].id_dosen
        await model_jadwal.store({
            jadwal_kuliah,
            id_kelas,
            id_matakuliah,
            id_dosen
        });
        let getJadwal = await model_jadwal.getAll()
        let id_jadwal = getJadwal[0].id_jadwal
        await model_ruangan.store({
            kelas,
            id_jadwal
        });

        req.flash('success', 'Data Berhasil Ditambahkan');
        res.redirect('/admin'); 

    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat menyimpan data');
    }
});

module.exports = router