const connection = require('../config/database')

class model_jadwal{
    static async getAll(){
        return new Promise((resolve, reject) => {
            connection.query("select * from jadwal order by id_jadwal desc", (err, rows)=>{
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
            connection.query("insert into jadwal set ?", Data, (err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async getId(id_jadwal){
        return new Promise((resolve, reject) => {
            connection.query('select * from jadwal where id_jadwal = ' + [id_jadwal], (err, rows)=>{
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
            connection.query("update jadwal set ? where id_jadwal = ", + id, Data,(err, rows)=>{
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
            connection.query("delete from jadwal where id_jadwal = ", + id,(err, rows)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(rows)
                }
            })
        })
    }

    static async updateStatusPresensi(id_jadwal, startAbsensi, endAbsensi) {
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE 
                    jadwal 
                SET 
                    start_absensi = ?, 
                    end_absensi = ? 
                WHERE 
                    id_jadwal = ?`;
            
            connection.query(query, [startAbsensi, endAbsensi, id_jadwal], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static async deletePresensi(id_jadwal) {
        return new Promise((resolve, reject) => {
            const query = `
                DELETE FROM 
                    presensi 
                WHERE 
                    id_jadwal = ?`;
            
            connection.query(query, [id_jadwal], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = model_jadwal;