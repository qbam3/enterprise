const connection = require('../config/database')

class model_kelas{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from class order by id_kelas desc", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async store(Data){
        return new Promise((resolve, reject) => {
            connection.query("insert into class set ?", Data, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from class where id_kelas = ' + id, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async Update(id ,Data){
        return new Promise((resolve, reject) => {
            connection.query("update class set ? where id_kelas = ?",  [Data, id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async Count(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(id_kelas) AS total_kelas FROM class",(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async joinGreat(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT dosen.nama_dosen, matakuliah.nama_mata_kuliah, ruangan.kelas, jadwal.jadwal_kuliah, mahasiswa.id_kelas, mahasiswa.id_mahasiswa, jadwal.id_jadwal, jadwal.start_absensi, jadwal.end_absensi FROM dosen left JOIN jadwal ON dosen.id_dosen = jadwal.id_dosen left JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah left JOIN ruangan ON jadwal.id_jadwal = ruangan.id_jadwal left join mahasiswa on mahasiswa.id_kelas = jadwal.id_kelas where mahasiswa.id_mahasiswa = ?",(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async Join(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT p.prodi, s.semester, k.* FROM prodi p left JOIN semester s ON p.id_semester = s.id_semester left join class k on k.id_prodi = p.id_prodi", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async Delete(id){
        return new Promise((resolve, reject) => {
            connection.query("delete from class where id_kelas = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_kelas;