var LocalStrategy   = require('passport-local').Strategy;

var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');

var connection = require('./connection');
connection.query('USE ' + dbconfig.database);

module.exports = {
    connection : connection
}
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) {

            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, {message:'That email is already taken.' });
                } else {

                    var newUserMysql = {
                        email: email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( email, password, firstname,lastname,phone1) values (?,?,?,?,?)";
                   
                    connection.query(insertQuery,[
                        
                            newUserMysql.email,
                             newUserMysql.password,
                             req.body.firstname,
                             req.body.lastname,
                             req.body.phone1
                        
                        ],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        newUserMysql.firstname = req.body.firstname;
                        newUserMysql.lastname = req.body.lastname;
                        newUserMysql.phone1 = req.body.phone1;
                       
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, {message: 'No user found.'}); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, {message: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
