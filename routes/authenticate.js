const express= require("express"),
    router = express.Router(),
    passport= require("passport"),
    LocalStrategy = require('passport-local').Strategy;

var connection = require('./../config/connection');
var dbconfig = require('./../config/database'); 
connection.query('USE ' + dbconfig.database);

router.get("/",(req,res)=> {
	res.render("home");
})

//Auth routes
router.get('/register',(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
        res.render('register');
    }  
})

router.post('/register',checkForm, passport.authenticate('local-signup', {
    successRedirect : '/users/login',
    failureRedirect : '/users/register',
    failureFlash : true 
}));

//Show Login Form
router.get("/login",(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/');
    }else{
        res.render("login");
    }	
})

router.post("/login",passport.authenticate("local-login",{	
        successRedirect: "/",
        failureRedirect: "/users/login",
        failureFlash: true,
        successFlash: true
	}) ,(req,res)=>{
        res.redirect('/');
});

// Logout route
router.get("/logout",(req,res)=>{
	req.logout();
	req.flash("success","Logged you out");
	res.redirect("/");
})



module.exports = router;

function checkForm(req, res, next) {
    req.checkBody('email','The email you entered is invalid,Please Try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    // req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('firstname', 'Firstname field cannot be empty.').notEmpty();
    req.checkBody('lastname', 'Lastname field cannot be empty.').notEmpty();
    req.checkBody('phone1', 'Contact number must be of 10 digits.').len(10);

    var errors = req.validationErrors();

    if(errors){
       console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('register',{
            errors:errors
        });
    }
	else{
		return next();
    }
}


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}