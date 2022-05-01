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
const sendRecoveryMail = (receiver,otp) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    
    const smtpTransport = nodemailer.createTransport({
        
        service: 'gmail',
        auth: {
            type: 'Bearer',
            user : 'mohamedhabib.benhlima@esprit.tn',
            pass : '181JMT1801'
            //user: SENDER_EMAIL_ADDRESS,
            //clientId: MAILING_SERVICE_CLIENT_ID,
            //clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            //refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            //accessToken
        }
    })

    const mailOptions = {
        from: 'Afar-team',
        to : receiver,
        subject: "Account recovery",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: green;">Welcome to Afar✮.</h2>
            <p>To be able to change your password you will need this secret code..
            </p>
            
            
            <p> This one : </p>
        
            <div>
            <h1>${otp}</h1>
            </div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions)
}

module.exports = sendRecoveryMail