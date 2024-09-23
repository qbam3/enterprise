const connection = require('../config/database')

class model_users{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from users order by id_users desc", (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async store(data){
        return new Promise((resolve, reject) => {
            connection.query("insert into users set ?", [data], (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
    static async Login(email){
        return new Promise((resolve, reject) => {
            connection.query("select * from users where email = ?", [email],(err, rows)=>{
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
            connection.query('select * from users where id_users = ' + id, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async Update(id ,data){
        return new Promise((resolve, reject) => {
            connection.query("update users set ? where id_users = ", + id, data,(err, rows)=>{
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
            connection.query("delete from user where id_users = ", + id,(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }
}

module.exports = model_users;