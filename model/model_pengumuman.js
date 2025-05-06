const connection = require('../config/database')

class model_pengumuman{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from pengumuman order by id_pengumuman desc", (err, rows)=>{
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
            connection.query("insert into pengumuman set ?", Data, (err, rows)=>{
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
            connection.query('select * from pengumuman where id_pengumuman = ' + id, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async getJoin(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('SELECT pengumuman.id_pengumuman, pengumuman.judul, pengumuman.deskripsi, matakuliah.nama_mata_kuliah FROM pengumuman JOIN jadwal ON pengumuman.id_jadwal = jadwal.id_jadwal JOIN matakuliah ON jadwal.id_matakuliah = matakuliah.id_matakuliah where pengumuman.id_jadwal = ?', [id_jadwal], (err, rows)=>{
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
            connection.query("update pengumuman set ? where id_pengumuman = ?", [Data, id],(err, rows)=>{
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
            connection.query("delete from pengumuman where id_pengumuman = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_pengumuman;