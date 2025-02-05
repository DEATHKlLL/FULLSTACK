require("dotenv").config();
const twilio = require("twilio");

// Load environment variables
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const twilioPhoneNumber = process.env.TWILIO_NO;

const client = twilio(accountSid, authToken);

// Function to send OTP
const sendOTP = async (phoneNumber, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
            from: twilioPhoneNumber, // Twilio Number
            to: phoneNumber, // User's Phone Number
        });
        console.log("OTP Sent Successfully: ", message.sid);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
};

module.exports = { sendOTP };
