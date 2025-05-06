const connection = require('../config/database')

class model_dosen{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from kategori order by id_kategori desc", (err, rows)=>{
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
            connection.query("insert into kategori set ?", Data, (err, rows)=>{
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
            connection.query('select * from dosen where id_dosen = ?', [id], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async getIdUsers(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from dosen where id_users = ?', [id], (err, rows)=>{
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

    static async updateStatusByJadwal(id_jadwal, data) {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE absensi SET pertemuan = ? WHERE id_jadwal = ?", [data.pertemuan, id_jadwal], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = model_dosen;