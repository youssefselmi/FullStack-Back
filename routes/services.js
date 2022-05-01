var express = require('express');
var router = express.Router();
var Service = require('../models/service');
const app = express();
app.use(express);



let cors = require("cors");
const service = require('../models/service');
router.use(cors());


router.get('/list',async(req,res)=>{
    

    try{
        
        Service.deleteMany(
            {signal:{$gte:3}}
        ).exec()
        const services = await Service.find()
        
        
        res.json(services)
  
    }catch(err){
        res.send('Error' + err)
    }
  })
  
  router.get('/:id',async(req,res)=>{
    try{
        const services = await Service.findById(req.params.id)
        res.json(services)
  
    }catch(err){
        res.send('Error' + err)
    }
  })
  router.delete('/delete/:id', function(req, res, next) {
    Service.findByIdAndRemove(req.params.id,function(err,docs){
      if(err)
      console.log(err);
      
      return res.status(200).json({
        success:true,
    })
  
    }) });
   
    
router.post('/add', function(req, res, next) {
    new Service({
             
        type : req.body.type,
        title : req.body.title,
        maxPart: req.body.maxPart,
        description : req.body.description,
        governorate : req.body.governorate,
        city:req.body.city,
        zipcode: req.body.zipcode,    
        disponibility: req.body.disponibility,
        weekend: req.body.weekend,
        day: req.body.day,
        night: req.body.night,
        addedat:req.body.addedat,
        signal:req.body.signal,


   

             })
             .save(
               (err, Service)=>{
    if (err) return res.json({succes:false,err});
                     console.log("error message :" +err);
                     return res.status(200).json({
                         success:true,
                     })
     
               }
             );
            })


            router.patch("/updateservice/:id", async(req, res) => {
              try {
                  const { id } = req.params;
          
                  const updateservice = await Service.findByIdAndUpdate(id, req.body, {
                      new: true
                  });
          
                  console.log(updateservice);
                  res.status(201).json(updateservice);
          
              } catch (error) {
                  res.status(422).json(error);
              }
          })
          router.post("/signal/:id", (req, res, next) => {
            Service.findOneAndUpdate({ _id: req.params.id }, { $inc: { signal: 1 } }).exec();
           
            
            res.json("done");
          });


module.exports = router;