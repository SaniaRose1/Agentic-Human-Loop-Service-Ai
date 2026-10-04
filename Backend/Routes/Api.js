import express from  'express';
import bcrypt from "bcryptjs";
import mongoose  from "mongoose";
import User from  '../model/User.js';
const router = express.Router();

router.post("/register" , async(req,res)=>{
  let {name ,section,Registration,password,role} = req.body;
  try{
    if (section) section = section.trim();
    if(Registration)Registration=Registration.trim();
    if (password) password = password.trim();
    if(role === "student"){
      const existingUser = await User.findOne({name,section});
      if(existingUser){
       return res.status(400).json({msg: "User already exists"});
      }
     if(!(/^\d{2}[A-Za-z]\d[A-Za-z]\d$/).test(section)){
      return res.status(400).json({
      message:"Invalid Section"
    });
     }

     if(!(/^\d{2}[A-Za-z]\d{3}[A-Za-z]\d{2}$/).test(Registration)){
      return res.status(400).json({
      message:"Invalid password"
    });
     }
      const newUser = new User({
        name,
        section , 
        Registration,
        role
      })

      const user = await User.create(newUser);
      res.status(201).json({
      msg: "registered successfully",
      user
    });

    }
   
    else if(role === "admin" ){
      const existingUser = await User.findOne({name});
      if(existingUser){
       return res.status(400).json({msg: "User already exists"});
      }
     
       const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
       password:hashedpassword,
        role
      })

      const user = await User.create(newUser);
      res.status(201).json({
      msg: "registered successfully",
      user
    });

    }

  }catch(error){
res.status(500).json({ error: error.message });
  }
})



router.post("/login", async(req,res)=>{
 let {name,section,Registration,password,role} = req.body;
   
  try {
    
    if(role === "student"){
       const user = await User.findOne({name,section});
          
       if(!user){
        return res.status(400).json({message:"User not found"})
       }
       
       
    if (Registration != user.Registration) {
      return res.status(400).json({message: "Invalid Credentials" });
    }

   
    if (user.role !== role) {
      return res.status(403).json({ message: "Wrong role selected" });
    }

   
    return res.status(200).json({
        message:"Login successful",
        role: user.role,
       user
      }
    );
    }


    else if(role === "admin"){
    const user = await User.findOne({name});

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

   
    if (user.role !== role) {
      return res.status(403).json({ message: "Wrong role selected" });
    }

   
    return res.status(200).json({
        message:"Login successful",
        role: user.role,
       user
      }
    );
  }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

export default router;