const {sendVerificationEmail} = require("../Utils/EmailService")
const {hashPassword,comparehash} = require("../Utils/bcrypt_hash");
// const {PG_Name,ShortStayBooking} = require("./../modals/account_s")
const {PG_Name,ShortStayBooking} = require("./../modals/relation.js")
const {cookie,verifyToken} = require("./../Utils/JWT")
const {Op,Sequelize, where } = require("sequelize")


const pglist = async(req,res)=>{
    const c=req.cookies.check
    if(!c){
        res.json({mssg:"LOGIN FIRST"})
    }else{
        const d= await verifyToken(c);
        if(d.role == "OWNER"){
            try {
                let { pgName, pgAddress, amenities,price,pincode,description,sharing } = req.body;
                console.log(req.body)
                const imageFiles = req.files.pgImages
                if (!imageFiles || imageFiles.length === 0) {
                    return res.status(400).json({ err: "No images uploaded" })
                }
                amenities = Array.isArray(amenities) ? amenities : [amenities]
                sharing = Array.isArray(sharing) ? sharing : [sharing]
                const imagePaths = imageFiles.map(file => file.filename)
                await PG_Name.create({name:pgName,email:d.email,address:pgAddress,emenities:amenities,img_path:imagePaths,Price:price,pincode:pincode,description:description,sharing:sharing},)
                res.status(200).json({mssg:"sucsess"})
            } catch (error) {
                res.status(500).json({err:error});
            }
        }else{
            res.json({err:"Dont has permission"})
        }
    }
}
const PGSearch = async(req,res)=>{
    try{
    const { search = "", amenity = "" } = req.query;

    const whereClause = {};
    if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
    }
    if (amenity) {
        whereClause[Op.or] = Sequelize.literal(
            `JSON_CONTAINS(emenities, '${amenity}')`
        );
    }
    whereClause.Approved = 1
    const pgs = await PG_Name.findAll({ where: whereClause,attributes: ["name", "email","address","img_path","Price","emenities","pincode"] });
    res.json(pgs)
}catch (error) {
    console.error("Error fetching PGs:", error);
    res.status(500).json({ error: error });
}}

const PGApprovalist = async(req,res)=>{
    const c=req.cookies.check
    const d = await verifyToken(c);
if(!c){
        res.status(400).json({err:"LOGIN FIRST"})
        return
}if(d.role == "OWNER"){
        const result = await PG_Name.findAll({where:{email:d.email},attributes: ["name", "email","address","img_path","Price","emenities","pincode","Approved"] })
        res.status(200).json(result)
    }else if(d.role == "ADMIN"){
        if(req.query.Approved==0){
            const result = await PG_Name.findAll({where:{Approved:0},attributes: ["id","name", "email","address","img_path","Price","emenities","pincode","Approved"] })
            res.status(200).json(result)
        }else if(req.query.Approved==1){
            const result = await PG_Name.findAll({where:{Approved:1},attributes: ["id","name", "email","address","img_path","Price","emenities","pincode","Approved"] })
            res.status(200).json(result)
            }
            else{
            const result = await PG_Name.findAll({attributes: ["id","name", "email","address","img_path","Price","emenities","pincode","Approved"] })
            res.status(200).json(result)
            }
    }else{
        res.status(401).json({err:"Dont has Permission"})
    }
}

const PGApprovalUpdate = async(req,res)=>{
    const c=req.cookies.check
    const d = await verifyToken(c);
if(!c){
    res.status(400).json({err:"LOGIN FIRST"})
    return
}
if(d.role == "ADMIN"){
    if(req.query.Approved  && req.query.id){
        const pg = await PG_Name.update({Approved:req.query.Approved},{ where: { id: req.query.id} });
        if(pg){
            res.status(200).json({mssg:"PG APProval updated"})
        }else{
            res.status(200).json({mssg:"PG doesnt exist"})
        }
    }else if(req.query.destroy==1 && req.query.id){
        const pg = await PG_Name.destroy({where:{id:req.query.id}});
        if(pg){
            res.status(200).json({mssg:"PG Deleted"})
        }else{
            res.status(200).json({mssg:"PG doesnt exist"})
        }
    }else{
        res.status(200).json({err:"Enter Correct Para"})
    }
}else{
    res.status(400).json({err:"Register as Admin"})
}}


const PgSlotBook = async(req,res)=>{
    const c=req.cookies.check
    const d = await verifyToken(c);
try{
if(!c){
        res.status(200).json({err:"LOGIN FIRST"})
        return
    }
if(d.role == "SEEKER"){
    const {start,end,sharing} = req.body
    if(!req.query.id){
        res.status(200).json({err:"Provide PG ID"})
        return
    }
    if(!start || !end || !sharing){
        res.status(200).json({err:"Para missing"})
        return
    }
    let id = await PG_Name.findOne({where:{id:req.query.id,Approved:1}})
    if(!id){
        res.status(200).json({err:"PG Does not exist"})
        return
    }
    id = await ShortStayBooking.findOne({where:{pg_id:req.query.id,email:d.email}}) 
    if(id){
        res.status(200).json({err:"you alredy has shot stay booked to this pg"})
        return
    }
    let date1 = new Date(end)
    let date2 = new Date(start)
    if((date1 - date2)/(1000 * 60 * 60 * 24)>2){
        res.status(200).json({err:"short stay cant be greater than 3"})
        return
    }
    await ShortStayBooking.create({pg_id:req.query.id,email:d.email,start_date:start,end_date:end,sharing:sharing})
    res.status(200).json({mssg:"Your Short Stay Booked in This PG"})
}else{
    res.status(200).json({err:"Registered as PG Seeker"})
}
}catch(error){
    res.status(400).json({err:error})
}}

const PgSlotBookview = async(req,res)=>{
    const c=req.cookies.check
    const d = await verifyToken(c);
try{
    if(!c){
        res.status(200).json({err:"LOGIN FIRST"})
        return
        }
    if(d.role == "SEEKER"){
        let result = await ShortStayBooking.findAll({where:{email:d.email}})
        res.status(200).json(result)
    }else{
        res.status(200).json({err:"Registered as PG SEEKER"})
    }
}catch(error){
}}


const PgSlotListByOwner = async (req, res) => {
    const cookie = req.cookies.check;
    const decoded = await verifyToken(cookie);
  
    if (!decoded || decoded.role !== "OWNER") {
      return res.status(403).json({ err: "Unauthorized access" });
    }
  
    try {
      const bookings = await ShortStayBooking.findAll({
        include: {
          model: PG_Name,
          attributes: ['id', 'name'],
          where: { email: decoded.email } // Filter PGs owned by this user
        }
      });
      res.status(200).json(bookings);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
};



module.exports = {pglist,PGSearch,PGApprovalist,PGApprovalUpdate,PgSlotBook,PgSlotBookview,PgSlotListByOwner}