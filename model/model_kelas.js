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
            connection.query("update class set ? where id_kelas = ", + id, Data,(err, rows)=>{
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


    static async Delete(id){
        return new Promise((resolve, reject) => {
            connection.query("delete from class where id_kelas = ", + id,(err, rows)=>{
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