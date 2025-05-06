const connection = require('../config/database')

class model_tugas{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from tugas order by id_tugas desc", (err, rows)=>{
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
            connection.query("insert into tugas set ?", [Data], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
   
    static async getId(id_tugas){
        return new Promise((resolve, reject) => {
            connection.query('select * from tugas where id_jadwal = ?' ,[id_tugas], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async getIdTugas(id_tugas){
        return new Promise((resolve, reject) => {
            connection.query('select * from tugas where id_tugas = ?' ,[id_tugas], (err, rows)=>{
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
            connection.query("update tugas set ? where id_tugas = ? ",  [Data, id],(err, rows)=>{
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
            connection.query("SELECT COUNT(id_tugas) AS total_materi FROM tugas",(err, rows)=>{
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
            connection.query("delete from tugas where id_tugas = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_tugas;