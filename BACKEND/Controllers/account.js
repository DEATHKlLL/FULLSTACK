const {sendVerificationEmail} = require("../Utils/EmailService")
const {hashPassword,comparehash} = require("../Utils/bcrypt_hash");
const crypto = require("crypto")
const {cookie,verifyToken} = require("./../Utils/JWT")
const {account,Token} = require("./../modals/account_s")
const {Op} = require("sequelize")
const fs = require('fs');

 const RegisterUser =async (req,res)=>{
    const {username , password , email ,role} = req.body
    try{
        if(!password){
            res.status(500).json({error:"Password cannot be empty"})
            return
        }
        let query = await account.create({email:email,username:username,email:email,password:await hashPassword(password),role:role})
            const token = crypto.randomBytes(64).toString("hex"); 
            const expiry = new Date(Date.now() + 36000000);
            let verify=await Token.create({email:email,token:token,expiry:expiry})
            let mail = await sendVerificationEmail(email,token)
            res.status(200).json({mssg:"User Registered Verification email send Plz Verify."})
        }
        catch(err){
            res.status(500).json({error:err.errors[0].message})
            }
}

 const ListUser = async (req,res)=>{
    console.log(req.path)
    res.status(200).json(await ListAccount())
 }


const VerifyUser = async(req,res)=>{
    try{
    const {email , password} = req.body
    if(!email || !password){
        res.status(200).json({error:"username and password both parameter required"})
        return
    }
    
    let token = await Token.findAll({where:{ token:req.query.verify }})
    if(token.length == 0 ){
        res.status(200).json({error:"Verification Token Does not Exist"})
        return
    }
    let date = new Date(token[0].expiry)
    let date2 = new Date(Date.now())
   
    if(date < date2 && token[0].email == email){
        const newtoken = crypto.randomBytes(64).toString("hex"); 
        const expiry = new Date(Date.now() + 3600000);
        await Token.update({token:newtoken,expiry:expiry},{where:{token:req.query.verify}})
        await sendVerificationEmail(token[0].email)
        res.status(200).json({mssg:"Verification Token Expired New Updated is Send To your Mail"})
        return
    }
    let accverify= await account.findAll({where:{email:email,isEVerified:0}})
    if(accverify.length > 0){
        if(token[0].email==accverify[0].email &&  await comparehash(password,accverify[0].password) ){
            await Token.destroy({where:{email:email}})
            await account.update({isEVerified:1},{where:{email:email}})
            res.status(200).json({mssg:"Your Email is Verified"})
            
        }else{
            res.status(200).json({error:"Wrong Email and Password"})
        }
    }else{
        res.status(200).json({error:"Wrong Email and Password"})
    }}catch(err){
        res.status(500).json({error:err.errors[0].message})
        }
    }
const LoginUser = async (req,res)=>{
    try{
        const {email , password} = req.body
        if(!email || !password){
            res.status(500).json({error:"username and password both parameter required"})
            return
        }
        let accverify= await account.findAll({where:{email:email,isEVerified:1}})
        let accnotverify=await account.findAll({where:{email:email,isEVerified:0}})

        if(accnotverify.length > 0){
            let token = await Token.findAll({where:{ email:email }})
            let date = new Date(token[0].expiry)
            let date2 = new Date(Date.now())
            if(date < date2){
                const newtoken = crypto.randomBytes(64).toString("hex"); 
                const expiry = new Date(Date.now() + 3600000);
                await Token.update({token:newtoken,expiry:expiry},{where:{email:email}})
                // await sendVerificationEmail(token[0].email)
                return res.status(500).json({error:"Verification Token Expired New Updated is Send To your Mail"})
            }
            return res.status(500).json({error:"Your Account is not verified"})
        }
        if(accverify.length == 0){
            return res.status(200).json({mssg:"Plz register first"})
        }
        if(await comparehash(password,accverify[0].password) ){
            let c= cookie({"email":email,role:await accverify[0].role},"1h")
            res.cookie('check', c, {
                httpOnly: true,
                secure:false, 
                sameSite: 'lax',
                maxAge: 3600000, 
              });
            return res.status(200).json({mssg:"You are Logged In"})
        }else{
            return res.status(200).json({mssg: 'Wrong password'})
        }
    }catch(error){res.status(500).json(error)}
}

const test = async(req,res)=>{
    // const email = req.user.email;  
    // res.status(200).json({
    //   message: "Successfully accessed /list route",
    //   userEmail: email,  
    // });
    const {username , password , email } = req.body
    try {
        const ans = await account.create({email:email,username:username,email:email,password:password})
        res.status(200).json(ans)
    } catch (error) {
        res.status(500).json(error)
    }
}

const file = async(req,res)=>{
    try{
    let imagePath= "C:/Users/nickm/Desktop/AtoZ/programming/FULLSTACK/BACKEND/public/images/" + req.query.name 
    console.log(imagePath)
    fs.readFile(imagePath, (err, data) => {
        if (err) {
            // If there's an error (e.g., file not found), send an error message
            return res.status(404).send('File not found');
        }
        res.setHeader('Content-Type', 'image/jpeg')
        res.send(data)
    })
}catch(error){console.log(error)}
}

const index = async(req,res)=>{
    const c=req.cookies.check
    if(!c){
        res.sendFile("/public/Seeker.html",{root:__dirname+"/../"})
    }else{
        const d= await verifyToken(c);
        if(d.role == "OWNER"){
            res.sendFile("/public/Owner.html",{root:__dirname+"/../"})
        }else if(d.role == "ADMIN"){
            res.sendFile("/public/admin/Admin.html",{root:__dirname+"/../"})
        }
        else{
            res.sendFile("/public/Seeker.html",{root:__dirname+"/../"})
        }
    }
}
const logout = (req,res)=>{
    res.clearCookie('check', { path: '/' })
    res.status(200).redirect('/')
}
const usersearch =async(req,res)=>{
    const c=req.cookies.check 
    const d= await verifyToken(c)
    try{
        if(d.role=="ADMIN"){
            console.log(req.query.search)
            if(req.query.search || req.query.search==""){
                const query = await account.findAll({
                    where: {email: {[Op.like]: "%"+req.query.search+"%"},id:{[Op.ne]:1}},
                    attributes: ["id","username", "email","role"], 
                  });
                res.status(200).json(query)
            }else if(req.query.id){
                await account.destroy({where:{id:req.query.id}})
                res.status(200)
            }
            else{
              res.status(500)
            }
            
        }else{
            res.status(500).json({mssg:"NOT AUTHORISED"})
        }
    }catch(error){
        console.log("errror")
    }
}

const profile = async(req,res)=>{
    console.log("test1")
    const c=req.cookies.check
    if(!c){
        res.json({mssg:"INVALID"})
    }else{
        const d= await verifyToken(c);
        if(d != "INVALID" ){
            res.json({username:d.username,email:d.email,role:d.role})}
        else{
            res.json({mssg:"INVALID"})
        }
    }
}

const pglist = async(req,res)=>{
    console.log("test1")
    const c=req.cookies.check
    if(!c){
        res.json({mssg:"LOGIN FIRST"})
    }else{
        const d= await verifyToken(c);
        if(d.role == "OWNER"){
            console.log(res);
        }else{
            res.json({mssg:"Dont has permission"})
        }
    }
}

const forgotpass = (req,res)=>{
    if(!res.query.verify){
    res.sendFile("/public/forget.html",{root:__dirname+"/../"})
    }else{
        res.sendFile("/public/forget.html",{root:__dirname+"/../"})
    }
}

const forgotpass1post = async(req,res)=>{
    try{
    const {password , confirmpassword} = req.body
    if(!password || !confirmpassword){
        res.status(200).json({error:"username and password both parameter required"})
        return
    }
    let forgot = await forgot.findAll({where:{ forgot:req.query.verify }})
    if(forgot.length == 0 ){
        res.status(200).json({error:"Token Does not Exist"})
        return
    }
    let date = new Date(token[0].expiry)
    let date2 = new Date(Date.now())
   
    if(date < date2 && token[0].email == email){
        const newtoken = crypto.randomBytes(64).toString("hex"); 
        const expiry = new Date(Date.now() + 3600000);
        await forgot.update({token:newtoken,expiry:expiry},{where:{token:req.query.verify}})
        await sendVerificationEmail(token[0].email)
        res.status(200).json({mssg:"Expired New Updated Token Send To your Mail to change password"})
        return
    }
    let accverify= await account.findAll({where:{email:email,isEVerified:0}})
    if(accverify.length > 0){
        if(token[0].email==accverify[0].email &&  await comparehash(password,accverify[0].password) ){
            await forgot.destroy({where:{email:email}})
            await account.update({password:""},{where:{email:email}})
            res.status(200).json({mssg:"Password Changed"})
        }else{
            res.status(200).json({error:"Error"})
        }
    }else{
        res.status(200).json({error:"Error"})
    }
    }catch(error){
    }
}
const forgetpass2post = async(req,res)=>{
    
}

module.exports = {forgotpass,pglist,profile,RegisterUser,ListUser,LoginUser,VerifyUser,index,file,logout,usersearch}