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

    static async joinId(id){
        return new Promise((resolve, reject) => {
            connection.query("SELECT jadwal.id_jadwal, jadwal.jadwal_kuliah, jadwal.start_absensi, jadwal.end_absensi FROM jadwal JOIN absensi ON jadwal.id_jadwal = absensi.id_jadwal where jadwal.id_jadwal = ?" , [id], (err, rows)=>{
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
   
    static async getId(id_absensi){
        return new Promise((resolve, reject) => {
            connection.query('select * from absensi where id_absensi = ?' [id_absensi], (err, rows)=>{
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

   
static async getAbsensiMahasiswa(id_absensi, id_mahasiswa) {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT absensi.id_absensi, mahasiswa.id_mahasiswa, absensi.batas_absensi, absensi.id_jadwal
            FROM detail_absensi 
            JOIN mahasiswa ON detail_absensi.id_mahasiswa = mahasiswa.id_mahasiswa
            JOIN absensi on detail_absensi.id_absensi = absensi.id_absensi
            WHERE absensi.id_absensi = ? AND mahasiswa.id_mahasiswa = ?`,
            [id_absensi, id_mahasiswa],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows[0]); // Mengambil hasil pertama
                }
            }
        );
    });
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

        static async getPertemuanCount(id_jadwal) {
            return new Promise((resolve, reject) => {
                connection.query("SELECT COUNT(id_absensi) as total_absensi FROM absensi where id_jadwal = ?",[id_jadwal], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0].total_absensi);
                    }
                });
            });
        }

        static async isAbsensiOpen(id_jadwal) {
            return new Promise((resolve, reject) => {
                connection.query(`SELECT status, id_absensi FROM absensi WHERE id_jadwal = ? and status = 'buka' order by id_jadwal desc`, 
                    [id_jadwal], 
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows[0]);
                        }
                    }
                );
            });
        }

        static async getStatusPresensi(id_jadwal) {
            return new Promise((resolve, reject) => {
                connection.query(
                    `SELECT status, id_absensi FROM absensi WHERE id_jadwal = ? ORDER BY history_pembuatan DESC LIMIT 1`,
                    [id_jadwal],
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });
        }

        static async getHistoriPresensi(id_jadwal) {
            return new Promise((resolve, reject) => {
                const query = `SELECT * FROM absensi WHERE id_jadwal = ? ORDER BY history_pembuatan DESC`;
                connection.query(query, [id_jadwal], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        }
        
        static async tutup(id_jadwal, status) {
            return new Promise((resolve, reject) => {
                connection.query(`UPDATE absensi SET status = ? WHERE id_jadwal = ?`, [status, id_jadwal], (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        }
        
}

module.exports = model_absensi;