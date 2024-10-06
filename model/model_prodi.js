const connection = require('../config/database')

class model_prodi{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from prodi order by id_prodi desc", (err, rows)=>{
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
            connection.query("insert into prodi set ?", Data, (err, rows)=>{
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
            connection.query('select * from prodi where id_prodi = ' + id, (err, rows)=>{
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
            connection.query("update prodi set ? where id_prodi = ", + id, Data,(err, rows)=>{
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
            connection.query("SELECT COUNT(id_prodi) AS total_prodi FROM prodi",(err, rows)=>{
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
            connection.query("delete from prodi where id_prodi = ", + id,(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_prodi;