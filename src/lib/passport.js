const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MagicLinkStrategy = require('passport-magic-link').Strategy;

const pool =require('../database');
const helpers = require('../lib/helpers');

//const { uuid } = require('uuidv4');//UPDATE
//const { getTemplate, sendEmail } = require('../lib/nodemailer'); //UPDATE
//const { getToken, getTokenData } = require('../lib/jwtconfig');  //UPDATE

passport.use('local.signin',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    //console.log(req.body)
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    //console.log(rows.length)
    if (rows.length > 0) {
      const user = rows[0];
      if(user.estatus=='validado'){
        const validPassword = await helpers.matchPassword(password, user.password)
       if (validPassword) {
        done(null, user, req.flash('success', 'Bienvenido ' + user.username));
       } else {
        done(null, false, req.flash('message', 'Password Incorrecto'));
       }
      }
      else{return done(null, false, req.flash('message', 'El usuario NO se encuentra validado.'));}
    } else {
      return done(null, false, req.flash('message', 'El usuario no existe.'));
    }
}));


passport.serializeUser((user,done)=>{

  done(null,user.id);

});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  done(null, rows[0]);
});





/*
async (req, username, password, done) => {

  const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows2.length > 0) {
    
    return done(null, false, req.flash('message', 'El usuario ya existe.'));}
  else {
    passport.use(new MagicLinkStrategy({
      secret: 'Capibara-secret',
      userFields: ['fullname', 'username'],
      tokenField: 'token'
   }, async(req, username, fullname, done) => {
    const code =uuid();
    const token=getToken({username,code});//UPDATE
    const template = getTemplate(fullname, token);

      return await sendESmail(username, template);
   }, async (req, username, password, done) => {
    const {fullname} = req.body;

     const newUser = {
        username,
        password,
        fullname 
    };

    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);

   }));
  }

}*/

/*
passport.use('magiclink',new MagicLinkStrategy({
  secret: 'Capibara-secret',
  userFields: ['fullname', 'username','password'],
  tokenField: 'token'
}, async(req, username, fullname, done) => {
  const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows2.length > 0) {
    
    return done(null, false, req.flash('message', 'El usuario ya existe.'));}
  else {
    const code =uuid();
    const token=getToken({username,code});//UPDATE
    const template = getTemplate(fullname, token);

    return await sendESmail(username, template);  
  }

  //async(req, username, password, done)
}, async (req, username, password, done) => {
  const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows2.length > 0) {
    
    return done(null, false, req.flash('message', 'El usuario ya existe.'));}
  
  else {
    
    const {fullname} = req.body;

    const newUser = {username, password, fullname };
    
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
  }

})); 
*/




/*
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {

    const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (!rows2.length > 0) {
     const {fullname} = req.body;

     const newUser = {
        username,
        password,
        fullname 
    };

    const code =uuid();
    const token=getToken({username,code});//UPDATE
    const template = getTemplate(fullname, token); //UPDATE
    await sendEmail(username, template);//UPDATE
    req.flash('success', 'Registro exitoso, verifica tu correo');

    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);}

    else {
      return done(null, false, req.flash('message', 'El usuario ya existe.'));
    }
}));*/


