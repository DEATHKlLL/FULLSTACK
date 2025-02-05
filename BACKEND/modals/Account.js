
const db= require("../DB/MySQL") 

const AddAccount= async (username,email,password,role)=>{
    try{
        return await db.query('insert into account(username,email,password,role) values(?,?,?,?)',[username,email,password,role])

    }catch(error){
        return error
    }
}
const ListAccount= async ()=>{
    try{
        return await db.query('select * from account')
    }catch(error){
        return error
    }
}
const Addtoken= async (email,token,expiry)=>{
    try{
        return await db.query('insert into Token(email,token,expiry) values(?,?,?)',[email,token,expiry])
    }catch(error){
        return error
    }
}
const Updatetoken= async (token,expiry,tokenexp)=>{
    try{

        return await db.query('update Token set token=? , expiry=? where token=?;',[token,expiry,tokenexp])
    }catch(error){
        return error
    }
}

const DeleteAccount= async (email)=>{
    try{
        return await db.query('delete from account where email=?',[email])

    }catch(error){
        return error
    }
}
const DeleteToken= async (email)=>{
    try{
        return await db.query('delete from Token where email=?',[email])

    }catch(error){
        return error
    }
}

const VerifyToken= async (token)=>{
    try{
        return await db.query('select email,expiry,token from Token where token=?',[token])
    }catch(error){
        return error
    }
}

const VerifyAccount= async (email,isEVerified)=>{
    try{
        return await db.query('select email,password from account where email=? && isEVerified=?',[email,isEVerified])

    }catch(error){
        return error
    }
}
const EVerified = async (email)=>{
    try{
        return await db.query('update account set isEVerified=1 where email=?',[email])

    }catch(error){
        return error
    }
}


module.exports = {AddAccount,ListAccount,Addtoken,DeleteAccount,DeleteToken,VerifyAccount,VerifyToken,EVerified,Updatetoken}