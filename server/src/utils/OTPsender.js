require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const sendOTP = async (phoneNumber, otp) => {
    try {
      const message = await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: '+18313152043', // Your Twilio number
        to: phoneNumber,
      });
      console.log(`OTP sent successfully: ${message.sid}`);
      return message.sid; // Returning the SID for reference
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; // Re-throwing to handle errors where the function is called
    }
  };
  module.exports = {sendOTP};
/*
function sendOTP(phoneNumber, otp) {
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: '+18313152043',  // Your Twilio number
      to: phoneNumber
    })
    .then(message => console.log(`OTP sent successfully: ${message.sid}`))
    .catch(error => console.error('Error sending OTP:', error));
}

// Example usage
sendOTP('+8801639317127', Math.floor(100000 + Math.random() * 900000));
*/