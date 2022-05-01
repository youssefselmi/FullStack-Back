const Users = require('../models/user');
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMailVerify')
const VerificationToken = require('../models/verificationToken');
const { isValidObjectId } = require('mongoose');
const sendEmailverified = require('./sendMailVerified')
var multer = require("multer");
const recoveryToken = require('../models/recoveryToken');
const sendEmailRecovery = require('./sendMailRecovery')
require("dotenv").config();
//const {CLIENT_URL} = process.env

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

const userController = {

 

register : async (req,res) =>{
try {
    const {firstName, lastName, email, password} = req.body;

    if(!firstName || !lastName || !email || !password)
        return res.status(400).json({msg : "Please fill in all fields !"});

    if(!validateEmail(email))
    return res.status(400).json({msg : "invalid email adress."});

    const Olduser = await Users.findOne({email})
    if(Olduser) return res.status(400).json({msg : "Email adress already in use."});

    if(password.length < 6) res.status(400).json({msg : "Password is too short, add a few characters buddy.Don't be cheap now."});

    const passwordHash = await bcrypt.hash(password,12);
    //console.log({password, passwordHash});

    const newUser = new Users({
      lastName,firstName,email,password : passwordHash
    })
     
    // GENERATE OTP
    const generateOTP = () =>{
      let otp = ''
      for(let i =0; i<=3 ;i++){
        const randVal = Math.round(Math.random()*9)
        otp= otp+ randVal
      }
      return otp
    }

    const otp = generateOTP()
    console.log(otp, newUser._id)
    const verificationToken = new VerificationToken({
      owner : newUser._id,
      token : otp
    })

    await verificationToken.save(); 
    await newUser.save();

   
    //TRY 42 EMAIL VERIFICATION DUMB WAY
    sendMail(newUser.email,otp)
    //SENDMAIL WITH OAUTH2  - failed
    /*const activation_token = createActivationToken(newUser)
    const url = `${CLIENT_URL}/user/activate/${activation_token}`
    sendMail(email,url)
  */
/*    res.json({msg : "Registration successful ! Please activate your account to proceed."})*/
res.status(200).json({ result: newUser});
}catch (err){
        return res.status(500).json({msg : err.message})
    }
}
,
verifyEmail : async (req,res) => {
  const {userId,otp} = req.body;
  if(!userId || !otp) return res.status(401).json({success : false,msg:"Email verification has failed."});
  if(!isValidObjectId(userId)) return res.status(401).json({success : false,msg:"Invalid user ID."});
  
  const user = await Users.findById(userId);

  if(!user) return res.status(401).json({success : false,msg:"Sorry User not found."});
  if(user.verified) return res.status(401).json({success : false,msg:"User is already verified."});

  const token = await VerificationToken.findOne({owner: user._id});

  if(!token) return res.status(401).json({success : false,msg:"Sorry user not found."});
  const isMatched = await token.compareToken(otp);
  if(!isMatched) return res.status(401).json({success : false,msg:"Please provide a valid token."})
  
  user.verified = true;
  await VerificationToken.findByIdAndDelete(token._id);
  const saved = await user.save();
  sendEmailverified(user.email)
  if(saved) return res.status(200).json({success:true, user})
  },

  //PASSWORD RECOVERY


  PasswordRecovery : async (req,res) => {
    const {email} = req.body;
  if(!email) return res.status(401).json({success : false,msg:"Email verification has failed."});
 
  const user = await Users.findOne({email});
  if(!user) return res.status(402).json({success : false,msg:"Sorry User not found."});

  
  const generateOTP = () =>{
    let otp = ''
    for(let i =0; i<=3 ;i++){
      const randVal = Math.round(Math.random()*9)
      otp= otp+ randVal
    }
    return otp
  }

  const otp = generateOTP()
  console.log(otp, user._id)
  const RecoveryToken = new recoveryToken({
    owner : user._id,
    token : otp
  })

  await RecoveryToken.save(); 

  const token = await recoveryToken.findOne({owner: user._id});
  if(!token) return res.status(403).json({success : false,msg:"Sorry user not found."});
   const saved = await user.save();
  sendEmailRecovery(user.email,otp)
  if(saved) return res.status(200).json({success:true, user})
  },


PasswordRecoveryVerify : async (req,res) => {
    const {email,otp,newPassword} = req.body;
  if(!email || !otp) return res.status(401).json({success : false,msg:"Email verification has failed."});
 
  const user = await Users.findOne({email});
  if(!user) return res.status(402).json({success : false,msg:"Sorry User not found."});
  const token = await recoveryToken.findOne({owner: user._id});
  if(!token) return res.status(404).json({success : false,msg:"Sorry user not found."});
  const isMatched = await token.compareToken(otp);
  await recoveryToken.findByIdAndDelete(token._id);
  
  const passwordHash = await bcrypt.hash(newPassword,12);
  user.password = passwordHash

  const saved = await user.save();
   if(saved) return res.status(200).json({success:true, user})
   else return res.status(400).json({success:false, passwordHash})
  
},

/*
additionalinformation : async (req,res) => {
    const {profession,location, interests,avatar,userid} = req.body;
    const user = Users.findById(userid)
      if(!user)return res.status(404).json({success : false,msg:"User not found. User ID is invalid."})

    user.profession = profession;
    user.location = location;
    user.interests = interests;

    const saved = await user.save();
      if(saved){
    return res.status(200).json({success:true, user})
              }
    }*/
}



function validateEmail (email){
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

 const createActivationToken = (payload) =>{
   return jwt.sign(payload , process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'} )
 }

 const createAccessToken = (payload) =>{
  return jwt.sign(payload , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'} )
}

const createRefreshToken = (payload) =>{
  return jwt.sign(payload , process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'} )
}

module.exports = userController