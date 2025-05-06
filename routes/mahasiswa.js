var express = require('express');
var router = express.Router();
const dayjs = require('dayjs');
var model_users = require('../model/model_users')
var model_dosen = require('../model/model_dosen')
var model_absensi = require('../model/model_absensi')
var model_mahasiswa = require('../model/model_mahasiswa')
const model_detail_absensi = require('../model/model_detail_absensi');
const model_jadwal = require('../model/model_jadwal');
const model_pengumuman = require('../model/model_pengumuman');
const model_matakuliah = require('../model/model_matakuliah');
var model_kelas = require('../model/model_kelas');
const model_materi = require('../model/model_materi');
var router = express.Router();

async function isAuthenticated(req, res, next) {
  try {
      if (!req.session.userId) {
          req.flash('error', 'Silakan login untuk mengakses halaman produk');
          return res.redirect('/login');
      }

      let user = await model_users.getId(req.session.userId);

      if (!user) {
          req.flash('error', 'User tidak ditemukan.');
          return res.redirect('/login');
      }

      let userRole = req.session.userRole;
      
      console.log("Session userId:", req.session.userId);
      console.log("Session userRole:", userRole);
      console.log("Database user role:", user.role);
      
      if (userRole !== '3') {
        req.flash('error', 'Role anda berbeda, akses ditolak.');
        return res.redirect('/login');
    } 
    next();
  } catch (error) {
      console.error("Error during authentication:", error);
      req.flash('error', 'Terjadi kesalahan saat autentikasi.');
      return res.redirect('/login');
  }
}





router.get('/:id_mahasiswa', isAuthenticated, async (req, res, next)=>{
    let Data = await model_users.getAll();
    let id_mahasiswa = req.params.id_mahasiswa
    let dataMahasiswa = await model_mahasiswa.getId(id_mahasiswa)
    let id_kelas = dataMahasiswa[0].id_kelas
    let dataJadwalJoin = await model_detail_absensi.join(id_kelas)
    let id_jadwal = dataJadwalJoin[0].id_jadwal
    res.render('users/index', {
        dataJadwalJoin,
        id_mahasiswa,
        Username: Data[0].username,
        matakuliah: dataJadwalJoin[0].nama_mata_kuliah,
        dosen: dataJadwalJoin[0].nama_dosen,
        ruangan: dataJadwalJoin[0].kelas,
        jadwal: dataJadwalJoin[0].jadwal_kuliah,
        start_absen: dataJadwalJoin[0].start_absensi,
        end_absen: dataJadwalJoin[0].end_absensi,
        id_jadwal,
    })
})

router.get(`/:id_mahasiswa/matakuliah/`, async function(req, res, next) {
  let id_mahasiswa = req.params.id_mahasiswa
  let dataMahasiswa = await model_mahasiswa.getId(id_mahasiswa)
  let id_kelas = dataMahasiswa[0].id_kelas
  let dataJadwalJoin = await model_detail_absensi.join(id_kelas)
  let id_jadwal = dataJadwalJoin[0].id_jadwal
  console.log(dataJadwalJoin)
  if(id_kelas === dataJadwalJoin[0].id_kelas )
    res.render('users/matakuliah', {
      dataJadwalJoin,
      id_mahasiswa,
      matakuliah: dataJadwalJoin[0].nama_mata_kuliah,
      dosen: dataJadwalJoin[0].nama_dosen,
      ruangan: dataJadwalJoin[0].kelas,
      jadwal: dataJadwalJoin[0].jadwal_kuliah,
      start_absen: dataJadwalJoin[0].start_absensi,
      end_absen: dataJadwalJoin[0].end_absensi,
      id_jadwal
    });
});

router.get('/:id_mahasiswa/matakuliah/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let id_mahasiswa = req.params.id_mahasiswa
    console.log(id, id_mahasiswa)
    let dataAbsensi = await model_absensi.getAll()
    let dataDetailAbsen = await model_detail_absensi.getAll()
    let dataMahasiswa = await model_mahasiswa.joinMahasiswa(id)
    let id_absensi = dataAbsensi[0].id_absensi
    let dataJadwal = await model_jadwal.getId(id)
    let dataJadwalJoin = await model_jadwal.join(id)
    let histori = await model_detail_absensi.getHistoriPresensi(id);
    let isAbsensiDone = await model_detail_absensi.isAbsenceDone(id_mahasiswa, id_absensi)
    let isAbsensiOpen = await model_absensi.isAbsensiOpen(id)
    console.log("id: ", id)
    console.log("id: ", dataJadwalJoin)
    console.log("id: ", id_mahasiswa)
    console.log(isAbsensiOpen)

    
    res.render('users/detail', {
        dataJadwal,
        dataJadwalJoin,
        id_mahasiswa,
        jadwal: dataJadwalJoin[0].jadwal_kuliah,
        nama_mata_kuliah: dataJadwalJoin[0].nama_mata_kuliah,
        nama_dosen: dataJadwalJoin[0].nama_dosen,
        id_jadwal: dataJadwal[0].id_jadwal,
        ruangan: dataJadwalJoin[0].kelas,
        start_absen: dataJadwalJoin[0].start_absensi,
        end_absen: dataJadwalJoin[0].end_absensi,
        histori,
        isAbsensiOpen: isAbsensiOpen,  
        isAbsensiDone: isAbsensiDone,
        dataAbsensi,
        dataMahasiswa,
        dataDetailAbsen
          
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan dalam mengambil data');
  }
});

router.post('/:id_mahasiswa/matakuliah/:id/absen', async (req, res, next) => {
  try {
      let dataAbsensi = await model_absensi.getAll();
      console.log(dataAbsensi);

      let id_absensi = dataAbsensi[0].id_absensi
      let id_mahasiswa = req.params.id_mahasiswa;
      let id_jadwal = req.params.id
      console.log("ID Absensi:", id_absensi);
      console.log("ID Mahasiswa:", id_mahasiswa);
      console.log("ID jadwal:", id_jadwal);

      if (!id_absensi || !id_mahasiswa) {
          req.flash('error', 'ID absensi atau ID mahasiswa tidak didefinisikan.');
          return res.redirect(`/mahasiswa/${id_mahasiswa}`); 
      }

      let data = await model_absensi.isAbsensiOpen(id_jadwal, id_absensi);
      if (!data) {
          req.flash('error', 'Data absensi tidak ditemukan untuk ID absensi tersebut.');
          return res.redirect(`/mahasiswa/${id_mahasiswa}`); 
      }
      console.log(data)

      const now = dayjs();
      const batasAbsensi = dayjs(data.batas_absensi);
      console.log("ID Jadwal:", id_jadwal);

      let tanggal_absensi = now.format('YYYY-MM-DD');
      let waktu_absensi = now.format('HH:mm:ss');

      let Data = {
          id_absensi, 
          id_mahasiswa, 
          tanggal_absensi,
          waktu_absensi
      };

      await model_detail_absensi.store(Data);
      res.redirect(`/mahasiswa/${id_mahasiswa}/matakuliah/${id_jadwal}`)
  } catch (error) {
      console.error("Error in absen route:", error);
      return res.json({ success: false, message: 'Terjadi kesalahan: ' + error.message });
  }
});


router.get('/:id_mahasiswa/pengumuman/:id_jadwal', async function(req, res, next) {
  let id_mahasiswa = req.params.id_mahasiswa
  let id_jadwal = req.params.id_jadwal
  let dataPengumuman = await model_pengumuman.getJoin(id_jadwal)
  res.render('users/pengumuman', {
    dataPengumuman,
    id_mahasiswa,
    id_jadwal
  });
});

router.get('/:id_mahasiswa/materi/:id_jadwal', async function(req, res, next) {
  let id_jadwal = req.params.id_jadwal
  let id_mahasiswa = req.params.id_mahasiswa
  let dataMateri = await model_materi.getId(id_jadwal)
  res.render('users/materi', {
    dataMateri,
    id_mahasiswa,
    id_jadwal
  });
});

router.get('/tugas', function(req, res, next) {
  res.render('users/tugas');
});

router.get('/absensi', async (req, res, next)=>{
    await model_absensi.getAll();
    res.render('absensi/index')
})
module.exports = router;
