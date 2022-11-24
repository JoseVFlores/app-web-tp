/*
passport.use('magiclink',new MagicLinkStrategy({
  secret: 'capibara-secret',
  userFields: ['fullname', 'username','password'],
  tokenField: 'token',
  verifyUserAfterToken: true
}, async(req, username, fullname, done) => {
  const rows2 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows2.length > 0) {
    
    return done(null, false, req.flash('message', 'El usuario ya existe.'));}
  else {
    const code =uuid();
    const token=getToken({username,code});//UPDATE
    const template = getTemplate(fullname, token);

    return await sendEmail(username, template);  
  }

  //async(req, username, password, done)
}, function verify(username) {
  return new Promise(function(resolve, reject) {

    const rows2 = pool.query('SELECT * FROM users WHERE username = ?', [username]);
  
    if (rows2.length > 0) {
    
    return done(null, false, req.flash('message', 'El usuario ya existe.'));}
  
  
    else {

    
      pool.query('SELECT * FROM users WHERE username = ?', [username], function(err, row) {
      if (err) { return reject(err); }
      if (!row) {
        pool.query('INSERT INTO users SET ? ', newUser, function(err) {
          if (err) { return reject(err); }
          newUser.id = result.insertId;
          var newUser = {
            username,
            password,
            fullname
          };
          return resolve(newUser);
        });
      } else {
        return resolve(row);
      }
    });
    }
  });
}));
*/









/*passport.use('magiclink',new MagicLinkStrategy({
    secret: 'capibara-secret',
    usernameFields: 'username',
    tokenField: 'token',
    verifyUserAfterToken: true
  }, function send(username, token) {
    var link = 'http://localhost:3000/login/email/verify?token=' + token;
    var msg = {
      to: username,
      from:"Validación METRONOT <validacion.metronot@gmail.com>",
      subject: "Confirmación de registro",
      text: '¡Hola! Haga clic en el siguiente enlace para finalizar el registro.\r\n\r\n' + link,
      html: '<h3>Hola ${ fullname }</h3><p>Para confirmar tu cuenta, ingresa al siguiente enlace:</p><p><a href="' + link + '">Sign in</a></p>',
    };
    return sendgrid.send(msg);
  }, function verify(username) {
    return new Promise(function(resolve, reject) {
      pool.query('SELECT * FROM users WHERE username = ?', [username], function(err, row) {
        if (err) { return reject(err); }
        if (!row) {
          pool.query('INSERT INTO users SET ? ', newUser, function(err) {
            if (err) { return reject(err); }
            newUser.id = result.insertId;
            var newUser = {
              username,
              password,
              fullname
            };
            return resolve(newUser);
          });
        } else {
          return resolve(row);
        }
      });
    });
  }));*/
  