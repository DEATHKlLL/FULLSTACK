const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.emailuser, 
        pass: process.env.emailpass
    },
});


const sendVerificationEmail = async (email, token) => {

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    
    const mail = {
        from: process.env.emailuser,
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
