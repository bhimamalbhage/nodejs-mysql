const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message: "Please provide an email and password"
            })
        }

        db.query('SELECT * FROM users WHERE email = ?',[email], async (error,results)=>{
            
            if(!results || !(await bcrypt.compare(password, results[0].password)) ){
                res.status(401).render('login',{
                    message: "Email or Password is incorrect"
                })
            }else{
                const id = results[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect('/dashboard');



            }
        })

    } catch (error) {
        console.log(error)
    }
}

exports.register = (req,res)=>{
    

    const { name,email,password, passwordConfirm, panno, dob, gender, profile} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error,results)=>{
        if(error)
        {
            console.log(error);
        }

        if(!name || !email || !password || !passwordConfirm || !panno || !dob || !gender || !profile)
        {
            return res.render('register',{
                message: {
                    name : name,
                    email: email,
                    panno: panno,
                    dob: dob,
                    gender: gender,
                    profile: profile,
                    alertMessage: "All fields are required"
                }
            })
        }
        if(results.length >0){
            return res.render('register',{
                message: {
                    name : name,
                    email: email,
                    panno: panno,
                    dob: dob,
                    gender: gender,
                    profile: profile,
                    alertMessage: "That email is already in use"
                }
            })
        }else if( password !== passwordConfirm){
            return res.render('register',{
                message: {
                    name : name,
                    email: email,
                    panno: panno,
                    dob: dob,
                    gender: gender,
                    profile: profile,
                    alertMessage: "Passwords do not match"
                }
            })
        }
    
        var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;

        if (!(regex.test(panno.toUpperCase()))) {
            return res.render('register',{
                message: {
                    name : name,
                    email: email,
                    panno: panno,
                    dob: dob,
                    gender: gender,
                    profile: profile,
                    alertMessage: "Invalid PIN"
                }
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        
        db.query('INSERT INTO users SET ?',{name:name, email: email, password: hashedPassword,panno:panno,dob:dob,gender:gender,profile: profile},(error, results)=>{
            if(error)
            {
                console.log(error);
            }else{
                return res.render('register',{
                    message: {
                        alertMessage: "User Registered"
                    }
                })
            }
        })

    });

}

exports.editProfile = (req,res) =>{
    const id = req.userId;
    const { name,email,panno, dob, gender, profile} = req.body;
    db.query('UPDATE users SET name= ?, email = ?, panno = ?, dob = ?, gender = ?, profile=? WHERE id = ?',[name,email,panno,dob,gender,profile,id],(error,updateResults)=>{
        if(error)
        {
            console.log(error);
        }else{
            // console.log(results);
            db.query('SELECT * FROM users WHERE id = ?',[id], (error,results) => {
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
                profile: profile,
                updateMessage: "Profile Updated"
            }
        });
            }) 

        }
    })
}