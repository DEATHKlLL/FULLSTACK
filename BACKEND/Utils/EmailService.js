const nodemailer = require("nodemailer");


// Create transporter (Use your email credentials)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pg.service000@gmail.com", // Replace with your email
        pass: "ulgl lyft dcll rjyw"
    },
});

// Function to send verification email
const sendVerificationEmail = async (email, token) => {
    // if(){
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    
    const mail = {
        from: "pg.service000@gmail.com",
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>`,
    };
    try {
        const check=await transporter.sendMail(mail);
        console.log("Verification email sent to:", check);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendVerificationEmail };
