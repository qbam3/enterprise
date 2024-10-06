var express = require('express');
var router = express.Router();
const dayjs = require('dayjs');
var model_users = require('../model/model_users')
var model_absensi = require('../model/model_absensi')
var model_semester = require('../model/model_semester')
var model_prodi = require('../model/model_prodi')
var model_kelas = require('../model/model_kelas')
var model_matakuliah = require('../model/model_matakuliah')
var model_jadwal = require('../model/model_jadwal')
var model_dosen = require('../model/model_dosen')
var model_ruangan = require('../model/model_ruangan')


router.get('/', async (req, res, next)=>{
    let DataUsers = await model_users.getAll();
    let CountIdDosen = await model_dosen.Count()
    let CountIdProdi = await model_prodi.Count()
    let CountIdKelas = await model_kelas.Count()

    let total_dosen = CountIdDosen[0].total_dosen;
    let total_prodi = CountIdProdi[0].total_prodi
    let total_kelas = CountIdKelas[0].total_kelas
    res.render('dosen/index', {
        Username: DataUsers[0].username,
        Email: DataUsers[0].email,
        total_dosen: total_dosen,
        total_kelas: total_kelas,
        total_prodi: total_prodi
    })
})

router.get('/matakuliah', async function(req, res, next) {
    try {
        let getJoin = await model_dosen.join();

        res.render('dosen/matakuliah', {
            getJoin,
            matakuliah: getJoin[0].nama_mata_kuliah,
            dosen: getJoin[0].nama_dosen,
            ruangan: getJoin[0].kelas,
            jadwal: getJoin[0].jadwal_kuliah,
            start_absen: getJoin[0].start_absensi,
            end_absen: getJoin[0].end_absensi
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
    }
});


router.get('/jadwal/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let jadwalData = await model_dosen.joinId(id); 
        let dataAbsensi = await model_absensi.getAll();
        let histori = "Belum ada histori presensi";
        console.log(id, jadwalData)


        if (dataAbsensi && dataAbsensi.length > 0) {
            histori = dayjs(dataAbsensi[0].history_pembuatan).format('YYYY-MM-DD HH:mm:ss'); 
        }
        
        if (jadwalData.length === 0) {
            return res.status(404).send('Jadwal tidak ditemukan untuk ID tersebut');
        }

        res.render('dosen/detail', {
            jadwal: jadwalData[0].jadwal_kuliah,
            nama_mata_kuliah: jadwalData[0].nama_mata_kuliah,
            nama_dosen: jadwalData[0].nama_dosen,
            id_jadwal: jadwalData[0].id_jadwal,
            ruangan: jadwalData[0].kelas,
            start_absen: jadwalData[0].start_absensi,
            end_absen: jadwalData[0].end_absensi,
            histori
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan dalam mengambil data');
    }
});



router.get('/materi', function(req, res, next) {
    res.render('materi/index');
});

router.get('/materi/create', function(req, res, next) {
    res.render('materi/create');
});

router.get('/pengumuman', function(req, res, next) {
    res.render('pengumuman/index');
});

router.get('/pengumuman/create', function(req, res, next) {
    res.render('pengumuman/create');
});

router.get('/tugas', function(req, res, next) {
    res.render('tugas/index');
});

router.get('/tugas/create', function(req, res, next) {
    res.render('tugas/create');
});

router.get('/absensi', async (req, res, next)=>{
    await model_absensi.getAll();
    res.render('absensi/index')
})




router.post('/jadwal/bukaPresensi', async (req, res, next) => {
    try {
        let id_jadwal = req.body.id_jadwal; 
        if (!id_jadwal) {
            req.flash('error', 'ID jadwal tidak didefinisikan.');
            return res.redirect('/some-error-page'); 
        }
        let dataJadwal = await model_jadwal.getId(id_jadwal);
        if (!dataJadwal) {
            req.flash('error', 'Jadwal tidak ditemukan.');
            return res.redirect('/some-error-page'); 
        }
        let total_absensi = await model_absensi.getPertemuanCount(id_jadwal);
        console.log("Current Pertemuan:", total_absensi);
        if (isNaN(total_absensi) || total_absensi === null || total_absensi === undefined) {
            total_absensi = 0;
        }
        if (total_absensi >= 16) {
            req.flash('error', 'Sudah mencapai batas pertemuan maksimum.');
            return res.redirect(`/dosen/jadwal/${id_jadwal}`);
        }
        let pertemuan = total_absensi + 1; 
        let history_pembuatan = Date.now()
        let batas_absensi = dayjs(history_pembuatan).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');
        let data = { pertemuan, id_jadwal, history_pembuatan, batas_absensi };
        await model_absensi.store(data);
        
        req.flash('success', 'Presensi berhasil dibuka.');
        res.redirect(`/dosen/jadwal/${id_jadwal}`);
    } catch (error) {
        console.error("Error in bukaPresensi route:", error);
        req.flash('error', 'Terjadi kesalahan saat membuka presensi: ' + error.message);
        res.redirect('/some-error-page'); 
    }
});









module.exports = router;
