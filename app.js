const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser=require("body-parser"),
	  passport = require("passport"),
      LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
      flash = require("connect-flash");
	  session = require('express-session');
	  expressValidator = require('express-validator');

const morgan = require('morgan');
const app =express();
const port = process.env.PORT || 3000;
require('./config/passport')(passport); 

//Routes Setup
const routes = require('./routes');

//View engine setup
app.set('view engine','ejs');


//Body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(flash()); 
app.use(methodOverride("_method"));

//Passport Config
app.use(session({
	secret:"Hello secret",
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;
  
	  while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	  }
	  return {
		param : formParam,
		msg   : msg,
		value : value
	  };
	}
}));

app.use(function(req,res,next){
	res.locals.user = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/",routes);
// app.use("/users",users);
// app.use("/users/profile",profile);
// app.use(express.static(__dirname + '/assets'));


app.get('/test',(req,res)=>{
    res.render('register');
})


app.listen(port,function(){
    console.log(`Server Started on ${port}`);
})
