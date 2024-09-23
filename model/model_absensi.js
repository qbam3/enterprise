const connection = require('../config/database')

class model_absensi{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from absensi order by id_absensi desc", (err, rows)=>{
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
            connection.query("insert into absensi set ?", Data, (err, rows)=>{
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
            connection.query('select * from absensi where id_absensi = ' + id, (err, rows)=>{
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
            connection.query("update absensi set ? where id_absensi = ", + id, Data,(err, rows)=>{
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
            connection.query("delete from absensi where id_absensi = ", + id,(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_absensi;