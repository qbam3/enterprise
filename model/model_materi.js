const connection = require('../config/database')

class model_materi{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from materi order by id_materi desc", (err, rows)=>{
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
            connection.query("insert into materi set ?", [Data], (err, rows)=>{
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
            connection.query('select * from materi where id_jadwal = ' + id, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async getIdMateri(id){
        return new Promise((resolve, reject) => {
            connection.query('select * from materi where id_materi =  ?', [id], (err, rows)=>{
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
            connection.query("update materi set ? where id_materi = ?", [Data, id],(err, rows)=>{
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
            connection.query("SELECT COUNT(id_materi) AS total_materi FROM materi",(err, rows)=>{
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
            connection.query("delete from materi where id_materi = ?", [id],(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_materi;