const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const bcrypt = require("bcrypt");
const db = require("../models/index");

module.exports = function (app) {
    passport.serializeUser(function (user, done) {
        console.log('serialize.');
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        console.log('desirialize.');
        try {
            db.User.findByPk(id).then(user => {
                done(null, user);
            })
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: "name",
        passwordField: "pass"
    },(name, pass, done) => {
        console.log("local-strategy.");
        db.User.findOne({
            where: {
                name:name
            }
        }).then(async (user) => {
            if(user==null){
                const msg='ユーザ名もしくはパスワードが一致しません。';
                console.log(msg);
                return done(null, false, {message: msg});
            }
            const comparepassword=await bcrypt.compare(pass, user.pass);
            if(comparepassword){
                console.log("pass.");
                return done(null, user);
            }
            else{
                const msg="ユーザ名もしくはパスワードが一致しません。";
                console.log(msg);
                return done(null, false, {message:msg});
            }
        })
    }));
    passport.initialize();

    // express session option
    var session_opt={
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        //1時間はsession 有効
        cookie: {maxAge:60*60*1000}
    }
    app.use(session(session_opt));
    app.use(passport.session());


};