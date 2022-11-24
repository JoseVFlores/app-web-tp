const pool =require('../database');
//const { uuid } = require('uuidv4');//UPDATE
const { v4: uuidv4 } = require('uuid')
const { getTemplate, sendEmail } = require('../lib/nodemailer'); //UPDATE
const { getToken, getTokenData } = require('../lib/jwtconfig');  //UPDATE
//const res = require('express/lib/response');

//(req, username, password, done)

const signUp = async (req, res) => {
   
    try {
  
        // Obtener la data del usuario: name, email
        const { fullname, username,password } = req.body;

        //console.log(req.body)
  
        // Verificar que el usuario no exista
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
  
        // Generar el código
        const code = uuidv4();

        // Crear un nuevo usuario
        //user = new User({ name, email, code });
  
        // Generar token
        const token = getToken({ username, code });
  
        // Obtener un template
        const template = getTemplate(fullname, token);
  
        // Enviar el email
        await sendEmail(username, template);
  
        /*res.json({
            success: true,
            msg: 'Registrado correctamente'
        });*/
  
    } catch (error) {
        console.log(error);
        return done(null, false, req.flash('message', 'El usuario ya existe.'));
    }
}


const confirm = async (req, res) => {
    try {
  
       // Obtener el token
       const { token } = req.params;
       
       // Verificar la data
       const data = await getTokenData(token);
  
       if(data === null) {

        res.json({
            success: true,
            msg: 'Erorr al obtener data'
        });
        //return done(null, false, req.flash('message', 'Error al obtener data.'));
       }
  
       //console.log(data);
  
       const { username, code } = data.data;
  
       // Verificar existencia del usuario
       const user = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
       
       if(!user.length > 0) {
        res.json({
            success: false,
            msg: 'Usuario no existe'
        });
        //return done(null, false, req.flash('message', 'Usuario no existe'));
       }

    
  
       // Verificar el código
       if(code !== data.data.code) {
            return res.redirect('/signup');
       }
  
       // Actualizar usuario
       //user.status = 'VERIFIED';
       //await user.save();
       await pool.query('UPDATE users SET estatus="validado" WHERE username = ?', [username]);       


  
       // Redireccionar a la confirmación
       return res.render('auth/login');
        
    } 
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: 'Error al confirmar usuario'
        });
        //return done(null, false, req.flash('message', 'Error al confirmar usuario'));
    }
}
  
  
module.exports = {
    signUp,
    confirm
}