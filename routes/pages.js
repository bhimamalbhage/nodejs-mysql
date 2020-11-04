const { decodeBase64 } = require("bcryptjs");
const express = require("express");

const router = express.Router();
const connectDB = require("../config/db");
const db = connectDB();

const auth = require('../middleware/auth');

router.get('/',(req,res)=>{
    res.render("index")
})

router.get('/register',(req,res)=>{
    res.render("register")
})

router.get('/login',(req,res)=>{
    res.render("login")
})

router.get('/profile',auth, (req,res)=>{

    db.query('SELECT * FROM users WHERE id = ?',[req.userId], (error,results) =>{
        if(error)
        {
            console.log(error);
        }
        const name = results[0].name;
        const email = results[0].email;
        const panno = results[0].panno;
        const dob = results[0].dob;
        const gender = results[0].gender;
        const profile = results[0].profile;
        
        res.render("profile",{
            message: {
                name : name,
                email: email,
                panno: panno,
                dob: dob,
                gender: gender,
                profile: profile
            }
        });
    })

})

router.get('/dashboard',auth, (req,res)=>{

    db.query('SELECT * FROM users WHERE id = ?',[req.userId], (error,results) => {
        if(error)
        {
            console.log(error);
        }
        console.log("Of Dashboard"+ results);
        const name = results[0].name;
        const email = results[0].email;
        const panno = results[0].panno;
        const dob = results[0].dob;
        const gender = results[0].gender;
        const profile = results[0].profile;
        res.render("dashboard",{
            message: {
                name : name,
                email: email,
                panno: panno,
                dob: dob,
                gender: gender,
                profile: profile
            }
        });
    })

})

router.get('/logout',(req,res)=>{
    res.clearCookie('jwt');
    res.redirect('/');
})

module.exports = router;