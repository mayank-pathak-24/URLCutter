const User=require('../models/user')
const {v4:uuidv4}=require('uuid')
const {setUser}=require('../Services/auth')

async function handleUserSignup(req,res){
    const {name,email,password}=req.body;
    await User.create({
        name,
        email,
        password

    })
    return res.redirect("/")
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user= await User.findOne({email,password})
    if(!user){
        return res.render("login",{error:"Invalid User Or Passowrd"})
    }
    
    const token=setUser(user);
    //res.cookie("uid",token)
    return res.json({token})
}
module.exports={handleUserSignup,handleUserLogin}