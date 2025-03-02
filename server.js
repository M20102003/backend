const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
app.use(express.json());

//Home page api
app.get('/',(req,res)=>{
    res.send('Hello World');
});

//Registration page api
app.post('/register',async(req,res)=>{
    const {username,email,password} = req.body;
    try{
         const hashedPassword = await bcrypt.hash(password,10);
            const user = new User({
                username,
                email,
                password:hashedPassword
            });
            await user.save();
            res.json({message:'User created successfully'});
            console.log('User created successfully');
    }
    catch(err){
        console.log(err);
    }
    res.send('Registration page');
});

//Login page api

app.post('/login',async(req,res)=>{
    const{email,password}=req.body;
try{
  const user=await User.findOne({email});
  if(!user || (await bcrypt.compare(password,user.password)))
  {
    return res.status(400).json({message:"Invalid Credentials"});
  }
  res.json({message:"Login Successfull",username:user.username});
}
catch(err)
{
  console.log(err);
}

});

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB connected successfully"));
app.listen(port,(err)=>{
    if(err) console.log(err);
    console.log('Server is running on port:'+port);
});