const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const {OAuth2} = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// send mail
const sendEmailverified = (receiver) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    
    
    const smtpTransport = nodemailer.createTransport({
        
        service: 'gmail',
        auth: {
            type: 'Bearer',
            user : 'mohamedhabib.benhlima@esprit.tn',
            pass : '181JMT1801'
      
        }
    })

    const mailOptions = {
        from: 'Afar-team',
        to : receiver,
        subject: "Welcome to ✮AFAR✮",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to ✮Afar✮.</h2>
            <p>     Congratulations!
                your e-mail is now verified.
            You're all set ! please enjoy Afar✮.
                
            </p>
            
            
            <h3> More than commerce ! ours is about community and sharing above all. </h3>
        
            <div>
            <h4>Brought to you by SKOLLS.</h4>
            </div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions)
}

module.exports = sendEmailverified