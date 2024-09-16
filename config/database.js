let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_ethol'
})
connection.connect((error)=>{
    if(!!error){
        console.log(error)
    }else{
        console.log('Terhubung Bosku')
    }
})
module.exports=connection;