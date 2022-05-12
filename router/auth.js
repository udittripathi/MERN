const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

require('../DB/conn');
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
        // if (password !== cpassword) {
        //     return res.status(500).send({error: "Passwords mismatch", code: 500});
        // }
     //   const hash = await argon2.hash(password);
        const newUser = new User({name, email, phone, work, password, cpassword});
        await newUser.save();
        
         return res.status(201).send({newUser});
    //     const user = await newUser.save();
    // res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code: 500});
    }


});

module.exports = router;