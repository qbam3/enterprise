const connection = require('../config/database')

class model_matakuliah{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from matakuliah order by id_matakuliah desc", (err, rows)=>{
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
            connection.query("insert into matakuliah set ?", [Data], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async joinKelas(){
        return new Promise((resolve, reject) => {
            connection.query("select m.*, k.nama_kelas,p.prodi, p.id_prodi from prodi p left join class k on p.id_prodi=k.id_prodi left join matakuliah m on m.id_kelas=k.id_kelas", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async join(id){
        return new Promise((resolve, reject) => {
            connection.query("SELECT dosen.nama_dosen, matakuliah.nama_mata_kuliah, ruangan.kelas, jadwal.jadwal_kuliah, jadwal.start_absensi, jadwal.end_absensi, jadwal.id_jadwal FROM dosen left JOIN jadwal ON dosen.id_dosen = jadwal.id_dosen left JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah left JOIN ruangan ON jadwal.id_jadwal = ruangan.id_jadwal where jadwal.id_dosen = ?", [id],(err, rows)=>{
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
            connection.query('select * from matakuliah where id_matakuliah = ' + id, (err, rows)=>{
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
            connection.query("update matakuliah set ? where id_matakuliah = ?", [Data, id],(err, rows)=>{
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
            connection.query("delete from matakuliah where id_matakuliah = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_matakuliah;