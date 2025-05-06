var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
var model_semester = require('../model/model_semester')
var model_prodi = require('../model/model_prodi')
var model_kelas = require('../model/model_kelas')
var model_matakuliah = require('../model/model_matakuliah')
var model_jadwal = require('../model/model_jadwal')
var model_users = require('../model/model_users')
var model_dosen = require('../model/model_dosen')
var model_mahasiswa = require('../model/model_mahasiswa')
var model_ruangan = require('../model/model_ruangan')



router.get('/:id_users', async (req, res, next)=>{
    let Data = await model_users.getAll()
    let id_users = req.params.id_users
    console.log(Data)
    res.render('admin/index',{
        Data,
        id_users,
        username: Data[0].username,
        email: Data[0].email
    })
})

router.get('/:id_users/edit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let Data = await model_users.getId(id_users)
    console.log(Data)
    res.render('admin/edit-user',{
        Data,
        id_users,
        username: Data[0].username,
        email: Data[0].email
    })
})
router.get('/:id_users/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    await model_users.Delete(id_users)
    
})
router.post('/:id_users/update', async (req, res, next)=>{
    let {username, password, email} = req.body
    let role;
    let id_users = req.params.id_users
    
        if(email.includes("mahasiswa")){
          role = '3'
        }else if(email.includes("dosen")){
          role = '2'
        }else{
          role = '1'
        }
    let enkripsi = await bcrypt.hash(password, 10);
    let data = {
      username,
      password: enkripsi,
      email,
      role
    }
    await model_users.Update(id_users, data);
    req.flash('success', 'berhasil register');
    res.redirect(`/admin/${id_users}`)
})

router.get('/:id_users/register', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let id_users = req.params.id_users
    res.render('auth/register',{
       DataUsers,
       DataProdi,
       id_users,
       role: DataUsers[0].role
    })
})

router.post('/:id_users/saveusers', async (req, res)=>{
    let {username, password, email} = req.body
    let role;
    let id_users = req.params.id_users
    
        if(email.includes("mahasiswa")){
          role = '3'
        }else if(email.includes("dosen")){
          role = '2'
        }else{
          role = '1'
        }
    let enkripsi = await bcrypt.hash(password, 10);
    let data = {
      username,
      password: enkripsi,
      email,
      role
    }
    await model_users.store(data);
    req.flash('success', 'berhasil register');
    res.redirect(`/admin/${id_users}/register`)
    
  })

router.get('/:id_users/dosen', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataDosen = await model_dosen.getAll()
    let id_users = req.params.id_users
    res.render('admin/dosen',{
       DataUsers,
       DataProdi,
       dataDosen,
       id_users,
       role: DataUsers[0].role
    })
})

router.get('/:id_users/mahasiswa', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let dataKelas = await model_kelas.getAll()
    let dataKelasJoin = await model_kelas.Join()
    let id_users = req.params.id_users
    console.log(DataUsers, dataMahasiswa)
    res.render('admin/mahasiswa',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       role: DataUsers[0].role,
       dataKelas,
       dataKelasJoin
    })
})
router.post('/:id_users/mahasiswa/submit', async (req, res, next)=>{
    let {nama_mahasiswa, id_kelas, jenis_kelamin, id_users} = req.body
    function generateRandomSixDigit() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    let nrp = generateRandomSixDigit();
    let id_usersku = req.params.id_users
    let Data = { nrp, nama_mahasiswa, id_kelas, jenis_kelamin, id_users}
    await model_mahasiswa.store(Data)
    req.flash('succes', 'mahasiswa berhasil ditambahkan')
    res.redirect(`/admin/${id_usersku}/mahasiswa`)
    
})

router.post('/:id_users/dosen/submit', async (req, res, next)=>{
    let {nama_dosen, agama, jenis_kelamin, id_users} = req.body
    let id_usersku = req.params.id_users
    let Data = { nama_dosen, agama,jenis_kelamin, id_users}
    await model_dosen.store(Data)
    req.flash('succes', 'mahasiswa berhasil ditambahkan')
    res.redirect(`/admin/${id_usersku}/dosen`)
    
})

router.get('/:id_users/prodi', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataSemester = await model_semester.Join()
    console.log(DataUsers, dataMahasiswa)
    res.render('prodi/index',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role
    })
})
router.get('/:id_users/prodi/create', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataSemester = await model_semester.getAll()
    console.log(DataUsers, dataMahasiswa, dataSemester)
    res.render('prodi/create',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role
    })
})

router.post('/:id_users/prodi/submit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let {prodi, id_semester} = req.body
    let Data = {prodi, id_semester}

    await model_prodi.store(Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/prodi`)
   
})

router.get('/:id_users/:id_prodi/edit', async (req, res, next)=>{
    let id_prodi = req.params.id_prodi
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getId(id_prodi)
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataSemester = await model_semester.getAll()
    console.log(DataProdi, dataMahasiswa)
    res.render('prodi/edit',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       id_prodi
    })
})

router.post('/:id_users/:id_prodi/update', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_prodi = req.params.id_prodi
    let {prodi, id_semester} = req.body
    let Data = {prodi: prodi, id_semester: id_semester}

    await model_prodi.Update(id_prodi, Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/prodi`)
   
})

router.get('/:id_users/:id_prodi/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_prodi = req.params.id_prodi
    
    await model_prodi.Delete(id_prodi)

    req.flash('succes', 'berhasil menghapus data prodi')
    res.redirect(`/admin/${id_users}/prodi`)
   
})

router.get('/:id_users/kelas', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataKelas = await model_kelas.Join()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    console.log(dataKelas, dataMahasiswa)
    res.render('kelas/index',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataKelas
    })
})

router.get('/:id_users/kelas/create', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataSemester = await model_semester.Join()
    console.log(DataUsers, dataMahasiswa, dataSemester)
    res.render('kelas/create',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role
    })
})

router.post('/:id_users/kelas/submit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let {nama_kelas, id_prodi} = req.body
    let Data = {nama_kelas, id_prodi}

    await model_kelas.store(Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/kelas`)
   
})

router.get('/:id_users/kelas/:id_kelas/edit', async (req, res, next)=>{
    let id_kelas = req.params.id_kelas
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_kelas.getId(id_kelas)
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataSemester = await model_semester.Join()
    console.log(DataProdi, dataMahasiswa)
    res.render('kelas/edit',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       id_kelas
    })
})

router.post('/:id_users/kelas/:id_kelas/update', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_kelas = req.params.id_kelas
    let {nama_kelas, id_prodi} = req.body
    let Data = {nama_kelas: nama_kelas, id_prodi: id_prodi}

    await model_kelas.Update(id_kelas, Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/kelas`)
   
})

router.get('/:id_users/kelas/:id_kelas/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_kelas = req.params.id_kelas
    
    await model_kelas.Delete(id_kelas)

    req.flash('succes', 'berhasil menghapus data prodi')
    res.redirect(`/admin/${id_users}/kelas`)
   
})

router.get('/:id_users/matakuliah', async (req, res, next)=>{
    let id_users = req.params.id_users
    let dataMatakuliah = await model_matakuliah.joinKelas()
    let DataUsers = await model_users.getAll()
    console.log('data: ',dataMatakuliah)
    res.render('matakuliah/index',{
       id_users,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataMatakuliah,
       DataUsers
    })
})

router.get('/:id_users/matakuliah/create', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataKelasJoin = await model_kelas.Join()
    let dataSemester = await model_semester.Join()
    console.log(dataKelasJoin)
    res.render('matakuliah/create',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataKelasJoin
    })
})

router.post('/:id_users/matakuliah/submit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let {nama_mata_kuliah, id_kelas} = req.body
    let Data = {nama_mata_kuliah, id_kelas}

    await model_matakuliah.store(Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/matakuliah`)
   
})

router.get('/:id_users/matakuliah/:id_matakuliah/edit', async (req, res, next)=>{
    let id_matakuliah = req.params.id_matakuliah
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_matakuliah.getId(id_matakuliah)
    let dataMahasiswa = await model_mahasiswa.getAll()
    let id_users = req.params.id_users
    let dataKelasJoin = await model_kelas.Join()
    let dataSemester = await model_semester.Join()
    console.log(DataProdi, dataMahasiswa)
    res.render('matakuliah/edit',{
       DataUsers,
       DataProdi,
       dataMahasiswa,
       id_users,
       dataSemester,
       id_matakuliah,
       dataKelasJoin
    })
})

router.post('/:id_users/matakuliah/:id_matakuliah/update', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_matakuliahKu = req.params.id_matakuliah
    let {nama_mata_kuliah, id_kelas} = req.body
    let Data = {nama_mata_kuliah, id_kelas}

    await model_matakuliah.Update(id_matakuliahKu, Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/matakuliah`)
   
})

router.get('/:id_users/matakuliah/:id_matakuliah/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_matakuliah = req.params.id_matakuliah
    
    await model_matakuliah.Delete(id_matakuliah)

    req.flash('succes', 'berhasil menghapus data prodi')
    res.redirect(`/admin/${id_users}/matakuliah`)
   
})
router.get('/:id_users/jadwal', async (req, res, next)=>{
    let id_users = req.params.id_users
    let dataMatakuliah = await model_matakuliah.joinKelas()
    let DataUsers = await model_users.getAll()
    let dataJadwal = await model_jadwal.joinJadwal()
    console.log(dataMatakuliah)
    res.render('jadwal/index',{
       id_users,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataMatakuliah,
       DataUsers,
       dataJadwal
    })
})

router.get('/:id_users/jadwal/create', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataDosen = await model_dosen.getAll()
    let id_users = req.params.id_users
    let dataKelasJoin = await model_kelas.Join()
    let dataSemester = await model_semester.Join()
    let dataMatakuliah = await model_matakuliah.joinKelas()
    console.log('dataKelas', dataKelasJoin, 'datasemester', dataSemester)
    res.render('jadwal/create',{
       DataUsers,
       DataProdi,
       dataDosen,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataKelasJoin,
       dataMatakuliah
    })
})

router.post('/:id_users/jadwal/submit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas, start_absensi, end_absensi} = req.body
    let Data = {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas, start_absensi, end_absensi}

    await model_jadwal.store(Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/jadwal`)
   
})

router.get('/:id_users/jadwal/:id_jadwal/edit', async (req, res, next)=>{
    let id_jadwal = req.params.id_jadwal
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_matakuliah.getId(id_jadwal)
    let dataDosen = await model_dosen.getAll()
    let id_users = req.params.id_users
    let dataMatakuliah = await model_matakuliah.joinKelas()
    let dataKelasJoin = await model_kelas.Join()
    let dataSemester = await model_semester.Join()
    res.render('jadwal/edit',{
       DataUsers,
       DataProdi,
       dataDosen,
       id_users,
       dataSemester,
       id_jadwal,
       dataKelasJoin,
       dataMatakuliah
    })
})

router.post('/:id_users/jadwal/:id_jadwal/update', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_jadwalKu = req.params.id_jadwal
    let {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas, start_absensi, end_absensi} = req.body
    let Data = {jadwal_kuliah, id_matakuliah, id_dosen, id_kelas, start_absensi, end_absensi}

    await model_jadwal.Update(id_jadwalKu, Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/jadwal`)
   
})

router.get('/:id_users/jadwal/:id_jadwal/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_jadwal = req.params.id_jadwal
    
    await model_jadwal.Delete(id_jadwal)

    req.flash('succes', 'berhasil menghapus data prodi')
    res.redirect(`/admin/${id_users}/jadwal`)
   
})
router.get('/:id_users/ruangan', async (req, res, next)=>{
    let id_users = req.params.id_users
    let dataMatakuliah = await model_matakuliah.joinKelas()
    let DataUsers = await model_users.getAll()
    let dataRuangan = await model_ruangan.getAll()
    let dataJadwal = await model_jadwal.joinJadwal()
    console.log(dataMatakuliah)
    res.render('ruangan/index',{
       id_users,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataMatakuliah,
       DataUsers,
       dataJadwal,
       dataRuangan
    })
})

router.get('/:id_users/ruangan/create', async (req, res, next)=>{
    let DataUsers = await model_users.getAll()
    let DataProdi = await model_prodi.getAll()
    let dataDosen = await model_dosen.getAll()
    let id_users = req.params.id_users
    let dataJadwal = await model_jadwal.joinJadwal()
    let dataKelasJoin = await model_kelas.Join()
    let dataSemester = await model_semester.Join()
    let dataMatakuliah = await model_matakuliah.joinKelas()
    console.log('dataKelas', dataKelasJoin, 'datasemester', dataSemester)
    res.render('ruangan/create',{
       DataUsers,
       DataProdi,
       dataDosen,
       id_users,
       dataSemester,
       username: DataUsers[0].username,
       email: DataUsers[0].email,
       role: DataUsers[0].role,
       dataKelasJoin,
       dataMatakuliah,
       dataJadwal
    })
})

router.post('/:id_users/ruangan/submit', async (req, res, next)=>{
    let id_users = req.params.id_users
    let {kelas, id_jadwal} = req.body
    let Data = {kelas, id_jadwal}

    await model_ruangan.store(Data)

    req.flash('succes', 'berhasil menambahkan data ruangan')
    res.redirect(`/admin/${id_users}/ruangan`)
   
})

router.get('/:id_users/ruangan/:id_ruangan/edit', async (req, res, next)=>{
    let id_ruangan = req.params.id_ruangan
    let DataUsers = await model_users.getAll()
    let dataRuangan = await model_ruangan.getId(id_ruangan)
    let dataDosen = await model_dosen.getAll()
    let id_users = req.params.id_users
    let dataMatakuliah = await model_matakuliah.joinKelas()
    let dataJadwal = await model_jadwal.joinJadwal()
    res.render('ruangan/edit',{
       DataUsers,
       dataRuangan,
       dataDosen,
       id_users,
       id_ruangan,
       dataMatakuliah,
       dataJadwal
    })
})

router.post('/:id_users/ruangan/:id_ruangan/update', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_ruanganKu = req.params.id_ruangan
    let {kelas, id_jadwal} = req.body
    let Data = {kelas, id_jadwal}

    await model_ruangan.Update(id_ruanganKu, Data)

    req.flash('succes', 'berhasil menambahkan data prodi')
    res.redirect(`/admin/${id_users}/ruangan`)
   
})

router.get('/:id_users/ruangan/:id_ruangan/delete', async (req, res, next)=>{
    let id_users = req.params.id_users
    let id_ruangan = req.params.id_ruangan
    
    await model_ruangan.Delete(id_ruangan)

    req.flash('succes', 'berhasil menghapus data prodi')
    res.redirect(`/admin/${id_users}/ruangan`)
   
})

module.exports = router