const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../model/userSchema');

router.get('/', (req, res) => {
    res.send(`Hello World authjs`);
});

router.post('/register', async (req, res) => {

    const {name, email, phone, work, password, cpassword } = req.body;
     
    if(!name  || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({error: "fill properly"});
    }
       
    try {

        const userExist = await User.findOne({ email: email});

        if(userExist) {
            return res.status(422).json({ error: "Email already Exist"});
        }else if(password != cpassword) {
            return res.status(422).json({ error: "password are not matching"});
        }else {
            const newUser = new User({name, email, phone, work, password, cpassword});

            //         // hash the password
            // const hashedPassword = await bcrypt.hash(password, 10);

            await newUser.save();
        
            return res.status(201).send({newUser});
        }
  
        

    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code: 500});
    }


});

router.post('/signin', async (req,res) => {
    try{
        let token;
        const {email,password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error: "Plz filled the data"})
        }

        const userLogin = await User.findOne({ email: email });

          // console.log(userLogin);
   
        if(userLogin) {
        const isMatch = await bcrypt.compare(password, userLogin.password);

        token = await userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly:true
        });

        if(!isMatch) {
            res.status(400).json({message: "Invalid Credentials pass "});
        } else {
            res.json({message: "User Signin Succefully"});
        }
        }else {
            res.status(400).json({message: "Invalid Credentials"});
        }



        
    } catch(err) {
        console.log(err);
    }
});


module.exports = router;