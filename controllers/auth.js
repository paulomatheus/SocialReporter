const User = require('../models/user')
const db = require('../util/database');
const Report = require('../models/report');
const bcryptjs = require('bcryptjs');

exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', { pageTitle: 'Social Reporter', path: '/user/signup', isAuthenticated: req.session.isLoggedIn });
}

exports.postSignUp = (req, res, next) => {
    const newName = req.body.name;
    const newPassword = req.body.password;
    const newEmail = req.body.email;

    

    if (newName != '' && newPassword != '' && newEmail != '') {
        return bcryptjs.hash(newPassword, 12).then(hashedPassowrd => {
            const newUser = new User(newName, hashedPassowrd, newEmail);
            console.log(newUser);
            newUser.save().then(() => {
                return res.redirect('/user/login');
            }).catch(err => {
                console.log(err);
                return res.redirect('/user/signup');
            })
        }); 

    }

    
}



exports.getLogIn = (req, res, next) => {
    res.render('auth/login', { pageTitle: 'Login - Social Reporter', path: '/user/login', isAuthenticated: req.session.isLoggedIn });
}

exports.postLogIn = (req, res, next) => {
    const reqName = req.body.name;
    const reqPassword = req.body.password;
    console.log(reqName, reqPassword);

    
    
    
    
    
    
    

    async function loginAttempt() {
        let [rows, fields] = await db.execute('SELECT * FROM userinfo WHERE name = ?', [reqName]);

        
        
        if (rows.length > 0) {
            bcryptjs.compare(reqPassword, rows[0].password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    console.log(req.session.isLoggedIn);
                    req.session.user = rows[0].name;
                    req.session.userData = rows[0];
                    console.log(req.session.user);
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                    
                }
                res.redirect('/user/login');
            }).catch(err => {
                console.log(err);
                res.redirect('/user/login');
            });
            
            

            
            
            


            
            
            
            
            


            
            
            

        } else {
            res.send('Incorrect Username and/or Password!');
        }
    }

    loginAttempt();

    
    
    
    
    
    
    
    
    
    
}


exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}