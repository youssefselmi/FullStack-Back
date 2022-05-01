var express = require('express');
var multer = require("multer");
const app =express();
var router = express.Router();
const Item = require('../models/item');
const cors =require('cors');
router.use(cors({
    origin: '*'
}));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}_${+new Date()}.jpg`);
    }
  });
  const upload = multer({
    storage
  });

/*router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });*/
  router.get('/afficher',async(req,res)=>{
      try{
          
          const items = await Item.find()
          console.log(items)
          res.json(items)

      }catch(err){
          res.send('Error' + err)
      }
  })
  router.get('/categorie',async(req,res)=>{
    const categorie=req.query.categorie;
    var condition=categorie ? { categorie: { $regex: new RegExp(categorie), $options: "i" }  } : {};
    Item.find(condition)
    .then(data=>{
        res.send(data);
    })
    .catch(err=>{
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving tutorials."
        })
    })
})
router.get('/njareb',async(req,res)=>{
    
    

   
   

  const items = await Item.find({favoris: true})

 console.log(items)
 var tab=new Array();
 for(var i=0;i<items.length;i++)
 {
     tab[i]=items[i].categorie
    // console.log(tab[i])
 }
 var h1=tab[0];
 var h2=tab[1];
 var h3 = tab[2];
 var h4=tab[3];
 var h5=tab[4];
 var h6=tab[6];
 var h7=tab[7];
 var h8=tab[8];
 var h9=tab[9];
 var h10=tab[10];

Item.find({categorie: {$in :[h1,h2,h3,h4,h5,h6,h7,h8,h9,h10]}})



    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });
})
router.get('/favoris',async(req,res)=>{
    varMatch = { $match : { "favoris":true} };
    varProject = { $project : {categorie:1, "_id":0}};
    Item.aggregate( [ varMatch, varProject ] )
    
  // Item.find({favoris: true},{categorie:1,_id:0})

    .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving tutorials."
        });
      });


})
  router.get('/:id',async(req,res)=>{
    try{
        const items = await Item.findById(req.params.id)
        res.json(items)

    }catch(err){
        res.send('Error' + err)
    }
})
  router.post('/ajouter',upload.single("photo"),async(req,res,next)=>{
   const path = req.file.path
   const pas = req.body.itemName
   const par = req.body.categorie
   const paz = req.body.price
   const pad =  req.body.descreption
    //console.log(req.file.path)
    //  onst { itemName, price , categorie} = req.body
   
      const item = new Item({
          
          itemName:pas,
          picture:path  ,
          price:paz ,
          categorie:par,
          descreption:pad
      })
      try{
           const a1= await item.save()
           res.json(a1)

      }catch(err){
          res.send('Error' + err)
      }

  })
  router.put('/modifer/:id',async(req,res)=>{
      try{
          const item = await Item.findById(req.params.id)
          console.log(item)
       //   item.itemName = req.body.itemName 
          item.price = req.body.price 
          
          const a1 = await item.save()
          res.json(a1)

      }catch(err){
          res.send('Error'+ err)
      }
  })
  router.delete('/supprimer/:id',async(req,res)=>{
    try{
        const item = await Item.findById(req.params.id)
        const a1 = await item.remove()
        res.send('Element supprime')
        

    }catch(err){
        res.send('Error'+ err)
    }
})
router.put('/modifier/:id/favoris',async(req,res)=>{
    try{
        const item = await Item.findById(req.params.id)
     //   item.itemName = req.body.itemName 
        item.favoris = true
        
        const a1 = await item.save()
        res.json(a1)

    }catch(err){
        res.send('Error'+ err)
    }
})

  


  module.exports = router;