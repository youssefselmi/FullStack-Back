var express = require('express');
var router = express.Router();
var Composant = require('../models/composant');
var Besoin = require('../models/besoin');
const app = express();
let cors = require("cors");
router.use(cors());
require('dotenv').config();
const nodemailer = require('nodemailer');
const { text } = require('express');
const log = console.log;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL , // TODO: your gmail account
      pass: process.env.PASSWORD // TODO: your gmail password
    }
});



router.post('/add', async(req, res, next) => { 
const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

try {  
    const {Name,Etat,Marque,Description,Image,Prix,Livraison} = req.body;

if(!Name || !Etat || !Marque || !Description || !Image || !Prix || !Livraison){
   return res.status(422).json("plz fill the data");
}
        const adduser = new Composant({
         Name,Etat,Marque,Description,Image,Prix,Livraison});
      const resultat=  await adduser.save();
     
        
     client.messages
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
      });

        const listBession = await Besoin.find({ Besoinrecherche:Name });
        listBession.map((B) => {


            let html = `
            <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Alert Email</title>
        </head>
        <body>
        <h1> Cliquer ici pour consulter la nouvelle annonce .</h1>
        <a href="http://localhost:3001/viewcomposant/${resultat._id}">Cliquer Ici</a>
        </body>
        </html>   
            `
            const mailOptions = {
                from: 'youssefselmi99@gmail.com', // TODO: email sender
                to: B.Email, // TODO: email receiver
                subject: 'Annonce Que vous cherchez depuis '+B.Datepostulation+' a ete postulé dans Afar.tn',
                html
              };
                    transporter.sendMail(mailOptions, (err, data) => {
                      if (err) {
                          return log('Error occurs');
                      }
                      return    res.status(201).json(adduser);
                  });
                
            
          })

          
        
            res.status(201).json(adduser);
       


      
      
} catch (error) {
       res.json(error);
}



})


/////////////////////////////////////////////////////////////////////////////////



router.put('/update', async(req, res) => {
    const newComposantName = req.body.newComposantName;
    // const newComposantEtat = req.body.newComposantEtat;

    const id = req.body.id;

    try {

        await Composant.findById(id, (err, updatedComposant) => {

            updatedComposant.Name = newComposantName;
            // updatedComposant.Etat = newComposantEtat;

            updatedComposant.save();
            res.send("update");
        });

    } catch (err) {
        console.log(err);
    }
});




router.delete('/delete/:id', async(req, res) => {

    const id = req.params.id;
    await Composant.findByIdAndRemove(id).exec();
    res.send("deleted");


});






router.get('/find/:id', async(req, res) => {



    try {
        console.log(req.params);
        const {id} = req.params;

        const userindividual = await Composant.findById({_id:id});
        console.log(userindividual);
        res.status(201).json(userindividual)

    } catch (error) {
        res.status(422).json(error);
    }

});












router.get('/read', function(req, res, next) {
    Composant.find(
        (err, composants) => {
            res.render(
                'composant.twig', {
                    title: "Composant list",
                    cont: composants
                }
            );
        }
    );
})



router.get("/readcomposants", async(req, res) => {
    Composant.find({}, (err, result) => {

        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})















router.patch("/updatecompo/:id", async(req, res) => {
    try {
        const { id } = req.params;

        const updatecomposant = await Composant.findByIdAndUpdate(id, req.body, {
            new: true
        });

        console.log(updatecomposant);
        res.status(201).json(updatecomposant);

    } catch (error) {
        res.status(422).json(error);
    }
})























module.exports = router;