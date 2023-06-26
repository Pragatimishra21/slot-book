const userModel = require('../models/UserModels')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const registerController = async(req,res) =>{
try {
    const existingUser = await userModel.findOne({email:req.body.email})
    if(existingUser)
    {
        return res.status(200).send({message:'User already exists' , success: false})
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({message:"Registration successfully" , success: true})

} catch (error) {
    console.log(error);
    res.status(500).send({success:false, message:`Register Controller ${error.message}`})
}
}

const loginController = async(req,res) =>{
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
          return res
            .status(200)
            .send({ message: "user not found", success: false });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Invlid EMail or Password", success: false });
        }
        const token = jwt.sign({ id: user.__id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.status(200).send({ message: "Login Success", success: true, token });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
      }
}

const authController = async(req,res)=>{
  try {
    const user = await userModel.findById({_id: req.body.userId});
    user.password = undefined;
    if(!user){
      return res.status(200).send({
        message:"user not found",
        success:false,
      })
    }
    else
      {
        res.status(200).send({
          success:true,
          data:user,
        })
      }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message:'auth error',
      success:false,
      error
    })
  }
}

module.exports = {loginController,registerController,authController};