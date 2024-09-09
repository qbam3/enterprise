let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_enterprise'
})
connection.connect(Function(error){
    if(error){
        console.log(error);
    }else{
        console.log('Connection to database!');
    }
})
module.exports=connection;