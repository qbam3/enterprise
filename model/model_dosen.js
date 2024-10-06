const connection = require('../config/database')

class model_dosen{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from dosen order by id_dosen desc", (err, rows)=>{
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
            connection.query("insert into dosen set ?", Data, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async join(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT dosen.nama_dosen, matakuliah.nama_mata_kuliah, ruangan.kelas, jadwal.jadwal_kuliah, jadwal.id_jadwal, jadwal.start_absensi, jadwal.end_absensi FROM dosen JOIN jadwal ON dosen.id_dosen = jadwal.id_dosen JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_jadwal = ruangan.id_jadwal", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async joinId(id){
        return new Promise((resolve, reject) => {
            connection.query("SELECT dosen.nama_dosen, matakuliah.nama_mata_kuliah, ruangan.kelas, jadwal.jadwal_kuliah, jadwal.id_jadwal, jadwal.start_absensi, jadwal.end_absensi FROM dosen JOIN jadwal ON dosen.id_dosen = jadwal.id_dosen JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah JOIN ruangan ON jadwal.id_jadwal = ruangan.id_jadwal where jadwal.id_jadwal = " + id, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async deletePresensi(id_absensi) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM 
                    absensi
                WHERE 
                    id_absensi = ?`;
            
            connection.query(query, [id_absensi], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    static async Count(){
        return new Promise((resolve, reject) => {
            connection.query("SELECT COUNT(id_dosen) AS total_dosen FROM dosen",(err, rows)=>{
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
            connection.query('select * from dosen where id_dosen = ' + id, (err, rows)=>{
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
            connection.query("update dosen set ? where id_user = ", + id, Data,(err, rows)=>{
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
            connection.query("delete from user where id_user = ", + id,(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_dosen;