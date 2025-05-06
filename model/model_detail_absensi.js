const connection = require('../config/database')

class model_detail_absensi{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from detail_absensi order by id_detail_absensi desc", (err, rows)=>{
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
            connection.query("insert into detail_absensi set ?", Data, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async isAbsenceDone(id_mahasiswa, id_absensi){
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(*) AS count FROM detail_absensi WHERE id_mahasiswa = ? AND id_absensi = ?", [id_mahasiswa, id_absensi], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows[0].count)
                }
            })
        })
    }
    static async countPresensi(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(id_detail_absensi) AS total FROM detail_absensi where id_absensi = (select id_absensi from detail_absensi order by id_absensi desc limit 1)", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows[0].total)
                }
            })
        })
    }

    static async getHistoriPresensi(id_jadwal) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM absensi WHERE id_jadwal = ? ORDER BY history_pembuatan DESC`;
            connection.query(query, [id_jadwal], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
   
    static async getId(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from detail_absensi where id_detail_absensi = ' + id, (err, rows)=>{
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
            connection.query("update detail_absensi set ? where id_detail_absensi = ", + id, Data,(err, rows)=>{
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
            connection.query("delete from detail_absensi where id_detail_absensi = ", + id,(err, rows)=>{
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
            connection.query("SELECT dosen.nama_dosen, matakuliah.nama_mata_kuliah, ruangan.kelas, jadwal.jadwal_kuliah, jadwal.id_jadwal, jadwal.start_absensi, jadwal.end_absensi, class.id_kelas FROM dosen left JOIN jadwal ON dosen.id_dosen = jadwal.id_dosen left JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah left JOIN ruangan ON jadwal.id_jadwal = ruangan.id_jadwal left join class on jadwal.id_kelas = class.id_kelas where jadwal.id_kelas = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }


}

module.exports = model_detail_absensi;