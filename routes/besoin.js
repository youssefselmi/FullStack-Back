var express = require('express');
var router = express.Router();
var Besoin = require('../models/besoin');
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











 
router.post('/addbesoin', async(req, res, next) => {  
  
 ////////////////////////////// SMS 1 /////////////////////////////// 
/* const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );*/
//////////////////////////////////////////////////////////////////////////



// console.log(req.body);
const {Name,Email,Besoinrecherche} = req.body;

if(!Name || !Email || !Besoinrecherche ){
    res.status(422).json("plz fill the data");
}
try {   
        const adduser = new Besoin({
         Name,Email,Besoinrecherche});

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
  from: 'youssefselmi99@gmail.com', // TODO: email sender
  to: Email, // TODO: email receiver
  subject: '[Alert Afar.tn][Besoin Enregsitré]',
  text: 'Nous avons eregistré Votre Besoin pour  '+Besoinrecherche+' On va vous notifier lorsque une nouvelle '+Besoinrecherche+' sera postuler  ! Merci pour votre Demande !  '
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




















router.get("/readbesoins", async(req, res) => {
  Besoin.find({}, (err, result) => {

      if (err) {
          res.send(err)
      }
      res.send(result)
  })
})


router.delete('/delete/:id', async(req, res) => {

  const id = req.params.id;
  await Besoin.findByIdAndRemove(id).exec();
  res.send("deleted");

});












































module.exports = router;