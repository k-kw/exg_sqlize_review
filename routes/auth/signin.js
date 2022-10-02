const express = require('express');
// const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();
const db = require('../../models/index');

router.get('/', (req, res, next)=> {
    var data={
        title:'Sign in',
        errormsg:req.flash('error')
    };
    res.render('auth/signin', data);
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/usertop',
    failureRedirect: '/signin',
    failureFlash: true
}
));

module.exports = router;