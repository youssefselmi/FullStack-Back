var express = require('express');
var router = express.Router();
var Need = require('../models/need');
const app = express();
let cors = require("cors");
router.use(cors());


/////////// Mailing///////////////////////////////////////////
require('dotenv').config();
const nodemailer = require('nodemailer');
const log = console.log;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL , // TODO: your gmail account
      pass: process.env.PASSWORD // TODO: your gmail password
    }
});
/////////////////////////////////////////////////////////////////











 
router.post('/addneed', async(req, res, next) => {  
  
 ////////////////////////////// SMS 1 /////////////////////////////// 
/* const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );*/
//////////////////////////////////////////////////////////////////////////



// console.log(req.body);
const {CodeP,Email,SearchFor} = req.body;

if(!CodeP || !Email || !SearchFor ){
    res.status(422).json("plz fill the data");
}
try {   
        const adduser = new Need({
         CodeP,Email,SearchFor});

        await adduser.save();
        res.status(201).json(adduser);

  ///////////////////////////////// SMS //////////////////////////////////
      /*  client.messages
        .create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: "+21653862672",
          body: "Votre Broken Piece a ete ajoutee avec sucess dans Afar.tn . Merci pour votre Annonce "
        })
        .then(() => {
      console.log("oui")
        })
        .catch(err => {
          console.log(err);         
        });*/
////////////////////////////////////////////////////////////////////////////////







////////////////////Mailing/////////////////////////
const mailOptions = {
  from: 'houssemeddine.chebbi@esprit.tn', // TODO: email sender
  to: Email, // TODO: email receiver
  subject: 'Alert Afar.tn',
  text: 'Nous avons eregistré Votre Besoin! Merci ! '
};
      transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return log('Error occurs');
        }
        return log('Email sent!!!');
    });
////////////////////////////////////////////////////////////////////////






        console.log(adduser);
} catch (error) {
    res.status(422).json(error);
}
})
































































module.exports = router;