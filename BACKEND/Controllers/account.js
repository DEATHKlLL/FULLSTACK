const {Updatetoken ,EVerified,VerifyAccount ,AddAccount,ListAccount,Addtoken,DeleteAccount,DeleteToken,VerifyToken} = require("./../modals/account")
const {sendVerificationEmail} = require("../Utils/EmailService")
const {hashPassword,comparehash} = require("../Utils/bcrypt_hash");
const crypto = require("crypto")

 const RegisterUser =async (req,res)=>{
    const {username , password , email } = req.body
    if(username && password && email){
        let query= await AddAccount(username,email,await hashPassword(password),"SEEKER")

        if(query.code == "ER_DUP_ENTRY"){
            res.status(201).json({"DATA":"User Exist Plz Login"})
            
        }
        else if(query.affectedRows == 1 ){
            const token = crypto.randomBytes(64).toString("hex"); 
            const expiry = new Date(Date.now() + 3600000);

            let verify=await Addtoken(email,token,expiry)
   
            if(verify.affectedRows == 1){
            var mail = await sendVerificationEmail(email,token)
            res.status(201).json({"DATA":"User Registered Verification email send Plz Verify."})
        }}
        else{
            res.status(500).json("error1")
        }
    }
    else{
        res.status(500).json({"Error":{"Result":"All parameter is required"}})
    
    }
}

 const ListUser = async (req,res)=>{
    console.log(req.path)
    res.status(200).json(await ListAccount())
 }


const VerifyUser = async(req,res)=>{
    const {email , password} = req.body
    if(!email || !password){
        res.status(200).json({"DATA":"username and password both parameter required"})
        return
    }
            let token = await VerifyToken(req.query.verify)
            if(token.length == 0 ){
                res.status(200).json({"DATA":"Verification Token Does not Exist"})
                return
            }
            let date = new Date(token[0].expiry)
            let date2 = new Date(Date.now())
            if(date < date2){
                const newtoken = crypto.randomBytes(64).toString("hex"); 
                const expiry = new Date(Date.now() + 3600000);
                var test = await Updatetoken(newtoken,expiry,token[0].token)
                await sendVerificationEmail(token[0].email)
                res.status(200).json({"DATA":"Verification Token Expired New Updated is Send To your Mail"})
                return
            }
            let accverify= await VerifyAccount(email,0)
            if(accverify.length > 0){
                if(token[0].email==accverify[0].email &&  await comparehash(password,accverify[0].password) ){
                    await DeleteToken(email)
                    await EVerified(email)
                    res.status(200).json({"DATA":"Your Email is Verified"})
                    
                }else{
                    res.status(200).json({"DATA":"Wrong Email and Password"})
                }
            }else{
                res.status(200).json({"DATA":"Wrong Email and Password"})
            }
    }

const LoginUser = async (req,res)=>{
        const {email , password} = req.body
        if(!email || !password){
            res.status(200).json({"DATA":"username and password both parameter required"})
            return
        }
        let accverify= await VerifyAccount(email,1)
        let accnotverify=await VerifyAccount(email,0)
        if(accnotverify.length > 0){
            return res.status(200).json({"DATA":"Your Account is not verified"})
        }
        if(accverify.length == 0){
            return res.status(200).json({"DATA":"Plz register first"})
        }
        if(await comparehash(password,accverify[0].password) ){
            return res.status(200).json({"DATA":"You are Logged In"})
        }else{
            return res.status(200).json({"DATA":"Wrong Email and Password"})
        }
}



module.exports = {RegisterUser,ListUser,LoginUser,VerifyUser}