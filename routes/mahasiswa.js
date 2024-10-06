var express = require('express');
var router = express.Router();
const dayjs = require('dayjs');
var model_users = require('../model/model_users')
var model_dosen = require('../model/model_dosen')
var model_absensi = require('../model/model_absensi')
var model_mahasiswa = require('../model/model_mahasiswa')
const model_detail_absensi = require('../model/model_detail_absensi');
const model_jadwal = require('../model/model_jadwal');
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

router.get('/matakuliah', async function(req, res, next) {
  let getJoin = await model_dosen.join();
    res.render('users/matakuliah', {
      getJoin,
      matakuliah: getJoin[0].nama_mata_kuliah,
      dosen: getJoin[0].nama_dosen,
      ruangan: getJoin[0].kelas,
      jadwal: getJoin[0].jadwal_kuliah,
      start_absen: getJoin[0].start_absensi,
      end_absen: getJoin[0].end_absensi
    });
});

router.get('/matakuliah/detail', function(req, res, next) {
  res.render('users/detail');
});

router.get('/jadwal/:id', async function(req, res, next) {
  try {
      let id = req.params.id;
      let jadwalData = await model_dosen.joinId(id);
      console.log(id, jadwalData)
      
      let dataAbsensi = await model_absensi.getAll()
      let dataMahasiswa = await model_mahasiswa.getAll()
      let id_absensi = dataAbsensi[0].id_absensi
      let id_mahasiswa = dataMahasiswa[0].id_mahasiswa
      
      if (jadwalData.length === 0) {
          return res.status(404).send('Jadwal tidak ditemukan untuk ID tersebut');
      }

      res.render('users/detail', {
          jadwal: jadwalData[0].jadwal_kuliah,
          nama_mata_kuliah: jadwalData[0].nama_mata_kuliah,
          nama_dosen: jadwalData[0].nama_dosen,
          id_jadwal: jadwalData[0].id_jadwal,
          ruangan: jadwalData[0].kelas,
          start_absen: jadwalData[0].start_absensi,
          end_absen: jadwalData[0].end_absensi,
          id_absensi,
          id_mahasiswa
          
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan dalam mengambil data');
  }
});

router.post('/jadwal/absen', async (req, res, next) => {
  try {
    let id_absensi = req.body.id_absensi;
    let id_mahasiswa = req.body.id_mahasiswa;

    console.log("ID Absensi:", id_absensi); // Pastikan nilai ini ada
    console.log("ID Mahasiswa:", id_mahasiswa);

    if (!id_absensi || !id_mahasiswa) {
      req.flash('error', 'ID absensi atau ID mahasiswa tidak didefinisikan.');
      return res.redirect('/mahasiswa');
    }

    // Menggunakan id_absensi untuk memeriksa apakah absensi terbuka
    let data = await model_absensi.isAbsensiOpen(id_absensi);
    
    // Memeriksa apakah data yang diterima valid
    if (!data) {
      req.flash('error', 'Data absensi tidak ditemukan untuk ID absensi tersebut.');
      return res.redirect('/mahasiswa');
    }

    const now = dayjs();
    const batasAbsensi = dayjs(data.batas_absensi); // Mengambil batas_absensi
    let id_jadwal = data.id_jadwal; // Mengambil id_jadwal

    console.log("ID Jadwal:", id_jadwal);

    if (now.isAfter(batasAbsensi)) {
      req.flash('error', 'Waktu untuk melakukan absensi sudah berakhir.');
      return res.redirect(`/mahasiswa/jadwal/${id_jadwal}`); 
    }

    let tanggal_absensi = now.format('YYYY-MM-DD');
    let waktu_absensi = now.format('HH:mm:ss');

    let Data = {
      id_absensi, // Pastikan data.id_absensi valid
      id_mahasiswa, // Menggunakan id_mahasiswa dari body request
      tanggal_absensi,
      waktu_absensi
    };

    await model_detail_absensi.store(Data);

    req.flash('success', 'Absensi berhasil dicatat.');
    res.redirect(`/mahasiswa/jadwal/${id_jadwal}`);
  } catch (error) {
    console.error("Error in absen route:", error);
    req.flash('error', 'Terjadi kesalahan saat melakukan absensi: ' + error.message);
    res.redirect('/some-error-page');
  }
});


router.get('/pengumuman', function(req, res, next) {
  res.render('users/pengumuman');
});

router.get('/materi', function(req, res, next) {
  res.render('users/materi');
});

router.get('/tugas', function(req, res, next) {
  res.render('users/tugas');
});

router.get('/absensi', async (req, res, next)=>{
    await model_absensi.getAll();
    res.render('absensi/index')
})
module.exports = router;
