

module.exports ={
    
    database: {
     host: process.env.DB_HOST || 'localhost',
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || 'Soporteremoto2022',
     database: process.env.DB_DATABASE || 'database_links',
     port: process.env.DB_PORT || '3306'
    } 
}



/*
module.exports ={
    
    database: {
     host: 'localhost',
     user: 'root',
     password: 'Soporteremoto2022',
     database: 'database_links'
    } 
}*/