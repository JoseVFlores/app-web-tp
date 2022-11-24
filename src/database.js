const mysql = require('mysql');
const { promisify } = require('util');
const Connection = require('mysql/lib/Connection');

const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connnection)=>{

    if (err){
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION CLOSED');
        }
        if(err.code==='ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code==='ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if(connnection) connnection.release();
    console.log('DB IS CONNECTED');
    return;
});

//PROMISIFY POOL QUERYS
pool.query = promisify(pool.query);

module.exports = pool;