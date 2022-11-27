//const { uuid } = require('uuidv4');
const { v4: uuidv4 } = require('uuid')
const { getToken, getTokenData } = require('../lib/jwtconfig');
const pool =require('../database');

// Obtener la data del usuario: name, email
//const {username,fullname} = req.body;

//GENERAR UUID
//const code =uuid();
const code =uuidv4();

//GENERAR TOKEN
//const token=getToken({username,code});


const nodemailer=require('nodemailer')
const {google}=require('googleapis')
const { oauth2 } = require('googleapis/build/src/apis/oauth2')
const router = require('../routes/Autenticacion')
const { content } = require('googleapis/build/src/apis/content')
const res = require('express/lib/response')

const CLIENT_ID="380869421426-n24tri30e33reshcadp9rrd1o6cp50kc.apps.googleusercontent.com"
const CLIENT_SECRET="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"
const REDIRECT_URI="https://developers.google.com/oauthplayground"
const REFRESH_TOKEN="1//04x7xmMt9gxQTCgYIARAAGAQSNwF-L9Ir1srpcXGaMBAHSNFwizSaWdup1LubY0Xwd8qsga4yvBgRZxCLFfVU1DVh1qqRe-j9zOg"

const oAuth2client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


oAuth2client.setCredentials({refresh_token:REFRESH_TOKEN});

const sendEmail = async (username, html) => {
    try{
        const accessToken=await oAuth2client.getAccessToken();
        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{
                type:"OAuth2",
                user:"validacion.metronot@gmail.com",
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRET,
                refreshToken:REFRESH_TOKEN,
                accessToken:accessToken,

            }, //FIN CREATE TRANSPORTER
        });
        const mailOptions={
            from:"Validación METRONOT <validacion.metronot@gmail.com>",
            to:username,//"validacion.metronot@gmail.com",
            subject:"Confirmación de registro",
            html
                
        };

        const result=await transporter.sendMail(mailOptions);
        return result;
    } catch(err){
        console.log(err);
    }
}
//sendMail()
//.then((result) => res.status(200).send("enviado"))
//.catch((error)=>console.log(error.message));

const getTemplate = (fullname, token) => {
    return `
      <head>
          <link rel="stylesheet" href="./style.css">
      </head>
      
      <div id="email___content">
          <h2>Hola ${ fullname }</h2>
          <p>Para confirmar tu cuenta, ingresa al siguiente enlace</p>
          <a
              href="http://crud-api-tp-app-production.up.railway.app/confirm/${ token }"
              target="_blank"
          >Confirmar Cuenta</a>
      </div>
    `;
}

module.exports = {
    sendEmail,
    getTemplate
  }
