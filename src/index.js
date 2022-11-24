const express=require('express');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const path=require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');

const { urlencoded } = require('express');
const res = require('express/lib/response');

const { database } = require('./keys');


//Inicializaciones 
const app=express();
require('./lib/passport'); //(passport)

//Settings
app.set('port',process.env.PORT || 4000);
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exphbs.engine({
    defaultLayout: 'main',
    layoutsDir:path.join(app.get('views'),'Layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers:require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

//Middleware

app.use(session({
    secret: 'Capibara-secret',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
  
app.use(flash());
app.use(morgan('dev'));
app.use(urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



//Variables globales
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
next(); 
})

//Rutas
app.use(require('./routes'));           //app.use(require('./routes/index.js'))
app.use(require('./routes/Autenticacion'));   //app.use(require('./routes/Autenticacion.js'))
app.use('/links',require('./routes/links.js')); //app.use(require('./links','./routes/links.js'))

//Archivos Publicos
app.use(express.static(path.join(__dirname,'public')));

//Startig Server
app.listen(app.get('port'), ()=> {

    console.log('server on port', app.get('port'));
})
