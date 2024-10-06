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

    // Contoh query dengan JOIN
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

        static async isAbsensiOpen(id_absensi) {
            return new Promise((resolve, reject) => {
                const query = `
                    SELECT batas_absensi, id_jadwal 
                    FROM absensi 
                    WHERE id_absensi = ?`;
        
                connection.query(query, [id_absensi], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (rows.length > 0) {
                            const batasAbsensi = rows[0].batas_absensi; // Ambil batas_absensi dari baris pertama
                            const id_jadwal = rows[0].id_jadwal; // Ambil id_jadwal
                            resolve({ batasAbsensi, id_jadwal }); // Resolve dengan objek yang berisi batas_absensi dan id_jadwal
                        } else {
                            resolve(null); // Resolve dengan null jika tidak ada catatan ditemukan
                        }
                    }
                });
            });
        }
        
}

module.exports = model_absensi;