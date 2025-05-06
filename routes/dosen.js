var express = require('express');
var router = express.Router();
const dayjs = require('dayjs');
const multer  = require('multer')
const path = require('path');
const fs = require('fs')
var model_users = require('../model/model_users')
var model_absensi = require('../model/model_absensi')
var model_semester = require('../model/model_semester')
var model_prodi = require('../model/model_prodi')
var model_kelas = require('../model/model_kelas')
var model_matakuliah = require('../model/model_matakuliah')
var model_jadwal = require('../model/model_jadwal')
var model_dosen = require('../model/model_dosen')
var model_ruangan = require('../model/model_ruangan')
var model_pengumuman = require('../model/model_pengumuman');
const model_mahasiswa = require('../model/model_mahasiswa');
let model_materi = require('../model/model_materi')
let model_tugas = require('../model/model_tugas')
const model_detail_absensi = require('../model/model_detail_absensi');


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
        let dataDosen = await model_dosen.getIdUsers(req.session.userId)
        dosenId = dataDosen[0].id_dosen
        
        console.log("Session userId:", req.session.userId);
        console.log("Session userRole:", userRole);
        console.log("Database user role:", user[0].role);
        
        if (userRole !== '2') {
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
  
  async function isSameDosenIs(req, res, next) {
    try {
        let dataDosen = await model_dosen.getIdUsers(req.session.userId)
        dosenId = dataDosen[0].id_dosen


        let urlDosenId = parseInt(req.params.id_dosen); 
        console.log(dosenId,urlDosenId)

        if (dosenId !== urlDosenId) {
            req.flash('error', 'Anda tidak memiliki akses ke halaman dosen ini.');
            return res.redirect('/login');
        }
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        req.flash('error', 'Terjadi kesalahan saat autentikasi.');
        return res.redirect('/login');
    }
  }

  const storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/file')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + baseName;
        cb(null, uniqueSuffix + ext);
    }
  })
  const storageTugas = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/tugas')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const uniqueSuffix = Date.now() + '-' + baseName;
        cb(null, uniqueSuffix + ext);
    }
  })
  
  const uploadFile = multer({ storage: storageFile })
  const uploadTugas = multer({ storage: storageTugas })
  
  
    router.get('/:id_dosen', isAuthenticated, isSameDosenIs ,async (req, res, next)=>{
        let DataUsers = await model_users.getAll();
        let CountIdDosen = await model_dosen.Count()
        let CountIdProdi = await model_prodi.Count()
        let CountIdKelas = await model_kelas.Count()
        let CountMahasiswa = await model_mahasiswa.Count()
        let getJoin = await model_dosen.join();
        
        let total_dosen = CountIdDosen[0].total_dosen;
        let total_prodi = CountIdProdi[0].total_prodi
        let total_kelas = CountIdKelas[0].total_kelas
        let total_mahasiswa = CountMahasiswa[0].total_mahasiswa
        let id_dosen = req.params.id_dosen
        let dataMatakuliah = await model_matakuliah.join(id_dosen)
        console.log(dataMatakuliah)
        res.render('dosen/index', {
            id_dosen,
            Username: DataUsers[0].username,
            Email: DataUsers[0].email,
            total_dosen: total_dosen,
            total_kelas: total_kelas,
            total_prodi: total_prodi,
            total_mahasiswa: total_mahasiswa,
            dataMatakuliah
        })
    })

    router.get('/:id_dosen/jadwal', isAuthenticated,isSameDosenIs ,async function(req, res, next) {
        try {
            let id_dosen = req.params.id_dosen
            let dataMatakuliah = await model_matakuliah.join()
            let getJoin = await model_dosen.join(id_dosen);
            let dataUsers = await model_users.getId(req.session.userId)
            console.log(id_dosen, getJoin, dataUsers)
            res.render('dosen/jadwal', {
            id_dosen,
            dataMatakuliah,
            getJoin,
            dataUsers
            });
        } catch (error) {
            console.error(error);
        }
    });


    router.get('/:id_dosen/matakuliah', isAuthenticated,isSameDosenIs, async function(req, res, next) {
        try {
            let id_dosen = req.params.id_dosen
            let dataMatakuliah = await model_matakuliah.join(id_dosen)
            res.render('dosen/matakuliah', {
            id_dosen,
            dataMatakuliah,
            });
        } catch (error) {
            console.error(error);
        }
    });


router.get('/:id_dosen/matakuliah/:id', isAuthenticated, isSameDosenIs,async function(req, res, next) {
    try {
        let id = req.params.id;
        let id_dosen = req.params.id_dosen
        let dataJadwal = await model_jadwal.getId(id)
        let dataJadwalJoin = await model_jadwal.join(id)
        let histori = await model_absensi.getHistoriPresensi(id);
        let dataMahasiswa = await model_mahasiswa.joinMahasiswa(id)
        let absensiAktif = await model_absensi.getStatusPresensi(id);
        let jumlahPresensi = await model_detail_absensi.countPresensi()

        console.log(jumlahPresensi)
        res.render('dosen/detail', {
            dataJadwal,
            id_dosen,
            jadwal: dataJadwalJoin[0].jadwal_kuliah,
            nama_mata_kuliah: dataJadwalJoin[0].nama_mata_kuliah,
            nama_dosen: dataJadwalJoin[0].nama_dosen,
            id_jadwal: dataJadwal[0].id_jadwal,
            ruangan: dataJadwalJoin[0].kelas,
            start_absen: dataJadwalJoin[0].start_absensi,
            end_absen: dataJadwalJoin[0].end_absensi,
            histori,
            absensiAktif,
            dataMahasiswa,
            jumlahPresensi
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan dalam mengambil data');
    }
});

router.post('/:id_dosen/bukaPresensi/:id_jadwal', isAuthenticated,isSameDosenIs,async (req, res, next) => {
   let id_jadwal = req.params.id_jadwal
   let id_dosen = req.params.id_dosen
   let total_absensi = await model_absensi.getPertemuanCount(id_jadwal);
        if (isNaN(total_absensi) || total_absensi === null || total_absensi === undefined) {
            total_absensi = 0;
        }
        if (total_absensi >= 16) {
            req.flash('error', 'Sudah mencapai batas pertemuan maksimum.');
            return res.redirect(`/dosen/matakuliah/${id_jadwal}`);
        }

        let jadwal = await model_jadwal.getId(id_jadwal);
        let startAbsensi = jadwal[0].start_absensi; 
        let endAbsensi = jadwal[0].end_absensi;
        console.log(startAbsensi, endAbsensi)

        const parseTimeToMilliseconds = (time) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
        };
    
        let startAbsensiMillis = parseTimeToMilliseconds(startAbsensi);
        let endAbsensiMillis = parseTimeToMilliseconds(endAbsensi);
        let duration = endAbsensiMillis - startAbsensiMillis;
        console.log(duration)
        
        let history_pembuatan = new Date() 

        let historyTime = new Date(history_pembuatan).getTime();
        if (isNaN(historyTime)) {
            return res.status(500).send('Kesalahan dalam membuat waktu history_pembuatan');
        }


        let batas_absensi = new Date(historyTime + duration)
        let Data = { id_jadwal, history_pembuatan, batas_absensi, status: "buka"};
        console.log(Data)
        await model_absensi.store(Data, duration);


        req.flash('success', 'absensi berhasil dibuka')
        res.redirect(`/dosen/${id_dosen}/matakuliah/${id_jadwal}`)
});

router.post('/:id_dosen/tutupPresensi/:id', isAuthenticated,isSameDosenIs, async (req, res, next) => {
    try {
        let id_jadwal = req.params.id;
        let id_dosen = req.params.id_dosen
        if (!id_jadwal) {
            req.flash('error', 'ID jadwal tidak didefinisikan.');
            return res.redirect('/some-error-page');
        }

        let dataJadwal = await model_jadwal.getId(id_jadwal);
        if (!dataJadwal) {
            req.flash('error', 'Jadwal tidak ditemukan.');
            return res.redirect('/some-error-page');
        }

        const status = 'tutup';
        await model_absensi.tutup(id_jadwal, status);

        req.flash('success', 'absensi berhasil ditutup')
        res.redirect(`/dosen/${id_dosen}/matakuliah/${id_jadwal}`)

    } catch (error) {
        console.error("Error in batalPresensi route:", error);
        req.flash('error', 'Terjadi kesalahan saat menutup presensi: ' + error.message);
        res.redirect('/some-error-page');
    }
});

router.get('/:id_dosen/materi/:id_jadwal', isAuthenticated,isSameDosenIs,async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let dataMateri = await model_materi.getId(id_jadwal)
    res.render('materi/index', {
        dataMateri,
        id_dosen,
        id_jadwal
    });
});

router.get('/:id_dosen/materi/:id_jadwal/create', isAuthenticated,isSameDosenIs,async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    res.render('materi/create', {
        id_dosen,
        id_jadwal,
    });
});
router.get('/:id_dosen/materi/:id_jadwal/edit/:id_materi', isAuthenticated,isSameDosenIs,async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let id_materi = req.params.id_materi
    let dataMateri = await model_materi.getIdMateri(id_materi)
    console.log(dataMateri)
    res.render('materi/edit', {
        id_dosen,
        id_jadwal,
        id_materi,
        dataMateri,
        fileIcons
    });
});

router.get('/:id_dosen/materi/:id_jadwal/delete/:id_materi', isAuthenticated,isSameDosenIs,async function(req, res, next) {
    let id_materi = req.params.id_materi
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let dataMateri = await model_materi.getIdMateri(id_materi)
    let fileLama = dataMateri[0].file_materi
    if(fileLama){
        const pathFile = path.join(__dirname, '../public/file', fileLama)
        fs.unlink(pathFile, (err) => {
            if (err) {
                console.error("Gagal menghapus file lama:", err);
            } else {
                console.log("File lama berhasil dihapus:", fileLama);
            }
        });
    }
    await model_materi.Delete(id_materi)
    res.redirect(`/dosen/${id_dosen}/materi/${id_jadwal}`);
});

router.post('/:id_dosen/materi/:id_jadwal/update/:id_materi', uploadFile.single('file_materi'), async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal;
    let id_dosen = req.params.id_dosen;
    let id_materi = req.params.id_materi;
    let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let upload = now
    let { judul_materi, old_file_materi } = req.body;

    let file_materi = req.file ? req.file.filename : old_file_materi;

    let Data = {
        judul_materi: judul_materi,
        upload,
        id_jadwal: id_jadwal,
        file_materi: file_materi
    };

    await model_materi.Update(id_materi, Data);

    if (req.file && old_file_materi) {
        const fs = require('fs');
        const oldFilePath = path.join(__dirname, '../public/file', old_file_materi);
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.log("Gagal menghapus file lama:", err);
            }
        });
    }
    res.redirect(`/dosen/${id_dosen}/materi/${id_jadwal}`);
});


router.post('/:id_dosen/materi/:id_jadwal/submit', uploadFile.single('file_materi'), async (req, res, next)=>{
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    let {judul_materi} = req.body
    let file_materi = req.file.filename
    let now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let upload = now
    console.log(upload)
    let Data = {id_jadwal, judul_materi, file_materi, upload}
    await model_materi.store(Data)
    res.redirect(`/dosen/${id_dosen}/materi/${id_jadwal}`)
})

router.get('/:id_dosen/pengumuman/:id_jadwal', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let dataPengumuman = await model_pengumuman.getJoin(id_jadwal)
    let dataJadwal = await model_jadwal.getId(id_jadwal)
    console.log(dataJadwal)
    let id_dosen = req.params.id_dosen
        res.render('pengumuman/index', {
            id_jadwal,
            id_dosen,
            dataPengumuman
        });
});
router.get('/:id_dosen/pengumuman/:id_jadwal/edit/:id_pengumuman', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_pengumuman = req.params.id_pengumuman
    let dataPengumuman = await model_pengumuman.getJoin(id_jadwal)
    console.log(dataPengumuman)
    let id_dosen = req.params.id_dosen
        res.render('pengumuman/edit', {
            id_jadwal,
            id_dosen,
            id_pengumuman,
            dataPengumuman
        });
});

router.post('/:id_dosen/pengumuman/:id_jadwal/update/:id_pengumuman', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    let id_pengumuman = req.params.id_pengumuman
    console.log(id_jadwal)
    let {judul, deskripsi} = req.body
    let Data = {judul: judul, deskripsi: deskripsi, id_jadwal}
    await model_pengumuman.Update(id_pengumuman, Data)
    res.redirect(`/dosen/${id_dosen}/pengumuman/${id_jadwal}`)
});

router.get('/:id_dosen/pengumuman/:id_jadwal/delete/:id_pengumuman', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    let id_pengumuman = req.params.id_pengumuman
    await model_pengumuman.Delete(id_pengumuman)
    res.redirect(`/dosen/${id_dosen}/pengumuman/${id_jadwal}`)
});

router.get('/:id_dosen/pengumuman/:id_jadwal/create/', async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let dataJadwal = await model_jadwal.getAll()
    let dataMatkul = await model_matakuliah.getAll()
    let id_jadwal = req.params.id_jadwal
    console.log(dataJadwal)
    res.render('pengumuman/create', {
        id_jadwal,
        id_dosen,
        dataJadwal,
        dataMatkul,
    });
});
router.post('/:id_dosen/pengumuman/:id_jadwal/submit', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    console.log(id_jadwal)
    let {judul, deskripsi} = req.body
    let Data = {judul, deskripsi, id_jadwal}
    await model_pengumuman.store(Data)
    res.redirect(`/dosen/${id_dosen}/pengumuman/${id_jadwal}`)
});

router.get('/:id_dosen/pengumuman/:id_jadwal/edit', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    console.log(id_jadwal)
    let {judul, deskripsi} = req.body
    let Data = {judul, deskripsi, id_jadwal}
    await model_pengumuman.store(Data)
    res.redirect(`/dosen/${id_dosen}/pengumuman/${id_jadwal}`)
});

router.get('/:id_dosen/pengumuman/:id_jadwal/update', async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    console.log(id_jadwal)
    let {judul, deskripsi} = req.body
    let Data = {judul, deskripsi, id_jadwal}
    await model_pengumuman.store(Data)
    res.redirect(`/dosen/${id_dosen}/pengumuman/${id_jadwal}`)
});

router.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, '../public/file', req.params.filename);
    res.download(file);
});
router.get('/downloadTugas/:filename', (req, res) => {
    const file = path.join(__dirname, '../public/tugas', req.params.filename);
    res.download(file);
});

router.get('/:id_dosen/tugas/:id_jadwal', async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let dataTugas = await model_tugas.getId(id_jadwal)
    res.render('tugas/index', {
        dataTugas,
        id_dosen,
        id_jadwal
    });
});

router.get('/:id_dosen/tugas/:id_jadwal/create', async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    res.render('tugas/create', {
        id_dosen,
        id_jadwal,
    });
});

router.post('/:id_dosen/tugas/:id_jadwal/submit', uploadTugas.single('file_tugas'), async (req, res, next)=>{
    let id_jadwal = req.params.id_jadwal
    let id_dosen = req.params.id_dosen
    let {deskripsi_tugas, deadline, judul_tugas} = req.body
    let file_tugas = req.file.filename
    const formattedDeadline = new Date(deadline).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    let Data = {deskripsi_tugas, deadline: formattedDeadline, file_tugas, id_jadwal, judul_tugas}
    await model_tugas.store(Data)
    res.redirect(`/dosen/${id_dosen}/tugas/${id_jadwal}`)
})

router.get('/:id_dosen/tugas/:id_jadwal/edit/:id_tugas', async function(req, res, next) {
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let id_tugas = req.params.id_tugas
    let dataTugas = await model_tugas.getIdTugas(id_tugas)
    console.log(dataTugas, id_tugas)
    res.render('tugas/edit', {
        id_dosen,
        id_jadwal,
        dataTugas,
        id_tugas

    });
});

router.get('/:id_dosen/tugas/:id_jadwal/delete/:id_tugas', async function(req, res, next) {
    let id_tugas = req.params.id_tugas
    let id_dosen = req.params.id_dosen
    let id_jadwal = req.params.id_jadwal
    let dataTugas = await model_tugas.getIdTugas(id_tugas)
    console.log(id_tugas)
    let fileLama = dataTugas[0].file_tugas
    if(fileLama){
        const pathFile = path.join(__dirname, '../public/tugas', fileLama)
        fs.unlink(pathFile, (err) => {
            if (err) {
                console.error("Gagal menghapus file lama:", err);
            } else {
                console.log("File lama berhasil dihapus:", fileLama);
            }
        });
    }
    await model_tugas.Delete(id_tugas)
    res.redirect(`/dosen/${id_dosen}/tugas/${id_jadwal}`);
});

router.post('/:id_dosen/tugas/:id_jadwal/update/:id_tugas', uploadTugas.single('file_tugas'), async function(req, res, next) {
    let id_jadwal = req.params.id_jadwal;
    let id_dosen = req.params.id_dosen;
    let id_tugas = req.params.id_tugas;
    let { judul_tugas, old_file_tugas, deskripsi_tugas, deadline } = req.body;
    const formattedDeadline = new Date(deadline).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
    let file_tugas = req.file ? req.file.filename : old_file_tugas;

    let Data = {
        judul_tugas: judul_tugas,
        deadline: formattedDeadline,
        id_jadwal: id_jadwal,
        file_tugas: file_tugas,
        deskripsi_tugas: deskripsi_tugas
    };

    await model_tugas.Update(id_tugas, Data);

    if (req.file && old_file_tugas) {
        const fs = require('fs');
        const oldFilePath = path.join(__dirname, '../public/tugas', old_file_tugas);
        fs.unlink(oldFilePath, (err) => {
            if (err) {
                console.log("Gagal menghapus file lama:", err);
            }
        });
    }
    res.redirect(`/dosen/${id_dosen}/tugas/${id_jadwal}`);
});

module.exports = router;
