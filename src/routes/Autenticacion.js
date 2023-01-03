const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const pool =require('../database');
const passport = require('passport');
//const { isLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const UserController = require('../lib/UserController');
const { v4: uuidv4 } = require('uuid')
const { getTemplate, sendEmail } = require('../lib/nodemailer'); //UPDATE
const { getToken, getTokenData } = require('../lib/jwtconfig');  //UPDATE


// SIGNUP

router.get('/signup', isNotLoggedIn, (req, res) => {
  res.render('auth/signup');
});

router.get(
  '/confirm/:token',
  [],
  UserController.confirm
);

router.post('/signup', async(req,res,done)=>{
 
  try {
  
    // Obtener la data del usuario: name, email
    const { fullname, username,password,empleado } = req.body;

    //console.log(req.body)

    // Verificar que el usuario no exista
    const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows2.length > 0) {
      
      return res.redirect('/registrado');
    }
    
    else {
      const {fullname,username} = req.body;
  
      // Generar el código
      const code = uuidv4();

      // Generar token
      //const token = getToken({ username, code });

      const token ="SIN TOKEN"

      // Obtener un template
      //const template = getTemplate(fullname, token);

      // Enviar el email
      //await sendEmail(username, template);

      const newUser = {username, password, fullname,empleado,code,token};
      
      newUser.password = await helpers.encryptPassword(password);
      // Saving in the Database
      const result = await pool.query('INSERT INTO users SET ? ', newUser);
      newUser.id = result.insertId;
      //return (null, newUser);
      return res.redirect('/confirm');
    }

    
    //console.log(code)

    // Crear un nuevo usuario
    //user = new User({ name, email, code });

    
    //console.log(token)
    

    

    

    /*res.json({
        success: true,
        msg: 'Registrado correctamente'
    });*/

  } 
  catch (error) {
    console.log(error);
    return req.flash('message', 'El usuario ya existe.');
  }
  //res.send('received');
  //UserController.signUp
  
});


/*
router.post('/signup',
    passport.authenticate('magiclink', { action : 'requestToken' }),
    (req, res) => res.redirect('auth/confirm')
);
*/
//router.get('/signup',isNotLoggedIn, (req, res) => {
/*router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
  });*/

  /*
  router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/', //successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
  }));
  */ 

 // SINGIN
 //router.get('/signin', isNotLoggedIn, (req, res) => {
  router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
  });
 
router.post('/signin', (req, res,next) => {
 
    passport.authenticate('local.signin', {

        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
 
    })(req, res,next);
});


router.get('/confirm',isNotLoggedIn,(req,res)=>{
  res.render('auth/confirm');
}) 

router.get('/registrado',isNotLoggedIn,(req,res)=>{
  res.render('auth/registrado');
}) 

router.get('/entradas',isNotLoggedIn,(req,res)=>{
  res.render('auth/entradas');
}) 

router.get('/denue',isLoggedIn,(req,res)=>{
  res.render('auth/denue');
}) 

router.get('/profile',isLoggedIn,(req,res)=>{

    res.render('profile'); 

  }); 

 router.get('/logout',isLoggedIn,(req,res,next)=>{
    
    req.logOut(req.user,err=>{
        if(err) return next(err);
        res.redirect('/signin');
    });
    

  });



module.exports=router;

