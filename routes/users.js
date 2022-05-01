var express = require('express');
const User = require('../models/user');
var router = express.Router();
const Users = require('../models/user');
const userController  = require ('../controllers/userController')
var multer = require("multer");
const cors =require('cors');

router.use(cors({
    origin: '*'
}));

//MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${+new Date()}.jpg`);
  }
});
//MULTER STORE FILE
const upload = multer({
  storage
});









//route for registration using oAuth2
router.post('/register',userController.register);
router.post('/verify-email',userController.verifyEmail);
router.post('/PasswordRecovery',userController.PasswordRecovery);
router.post('/PasswordRecoveryVerify',userController.PasswordRecoveryVerify)
//dumbRoute

router.post('/addinfo',upload.single('photo') ,async(req,res) =>{
  
const {profession,location, interests,userid,avatar} = req.body;



try{
  const replaced = await User.findById(userid)
  replaced.profession = profession;
  replaced.location = location;
  replaced.interests = interests.split(/(\s+)/);
  replaced.additionalInfo = true;
  replaced.avatar = avatar;

  const messageBack = await replaced.save()
  res.json(messageBack)

}catch(err){
  res.send('Error'+ err)
}


/*const saved = await user.save();

if(saved) return res.status(200).json({success:true, user})
  else return res.status(500).json({success:false, user})
*/});




router.get('/afficher',async(req,res)=>{
  try{
      const users = await User.find()
      res.json(users)

  }catch(err){
      res.send('Error' + err)
  }
})

router.get('/:id',async(req,res)=>{
  try{
      const user = await User.findById(req.params.id)
      res.json(user)

  }catch(err){
      res.send('Error' + err)
  }
})

router.get('/getUserFromEmail',async(req,res)=>{
  const email = req.body.email;
  try{
      const user = await User.findOne(email)
      res.json(user)
  }catch(err){
      res.send('Error' + err)
  }
})



router.put('/modifier/:id',async(req,res)=>{
  try{
      const user = await User.findById(req.params.id)
      user.firstname = req.body.firstname,
      user.lastname  = req.body.lastname,
      user.password = req.body.password
      user.interests = req.body.interests.split(/(\s+)/);
      user.location = req.body.location
      user.profession = req.body.profession
      
      const messageBack = await user.save()
      res.json(messageBack)

  }catch(err){
      res.send('Error'+ err)
  }
})



router.put('/ban/:id',async(req,res)=>{
  try{
    const user = await User.findById(req.params.id)
      user.accountState ="Banned"
      const messageBack = await user.save()
      res.json(messageBack)
    

  }catch(err){
    res.send('Error'+ err)
  }
})

router.put('/unban/:id',async(req,res)=>{
  try{
    const user = await User.findById(req.params.id)
      user.accountState ="Active"
      const messageBack = await user.save()
      res.json(messageBack)
    

  }catch(err){
    res.send('Error'+ err)
  }
})

router.put('/delete/:id',async(req,res)=>{
  try{
      const user = await User.findById(req.params.id)
      const messageBack = await user.remove()
      res.json(messageBack)
  }catch(err){
    res.send('Error'+ err)
  }
})



module.exports = router;
