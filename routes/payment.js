var express = require('express');
var router = express.Router();
var Composant = require('../models/composant');
const app = express();
const Razorpay = require("razorpay");
const crypto = require("crypto");
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











router.post("/orders", async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}





////////////////////Mailing/////////////////////////
/*const mailOptions = {
	from: 'youssefselmi99@gmail.com', // TODO: email sender
	to: 'youssefselmi99@gmail.com', // TODO: email receiver
	subject: 'Payment succesfully',
	text: 'Votre transactiona est effectué avec succes '
  };
		transporter.sendMail(mailOptions, (err, data) => {
		  if (err) {
			  return log('Error occurs');
		  }
		  return log('Email sent!!!');
	  });*/
  ////////////////////////////////////////////////////////////////////////
  
  




	
});
  
router.post("/verify", async (req, res) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.KEY_SECRET)
			.update(sign.toString())
			.digest("hex");	

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });

	













		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}




});

module.exports = router;