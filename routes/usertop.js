const express = require('express');
const router = express.Router();
const my_funcs = require('../my_funcs/my_funcs');

router.get('/', (req, res, next) => {
    if(my_funcs.login_check(req,res,'/top')){
        const loginuser=req.user;
        const name=loginuser.name
        const mail=loginuser.mail
        var data = {
            title: '自由にレビューを書いてください。',
            content: 'ユーザ名: ' + name + '<br>' +
                'メールアドレス: ' + mail + ''
        };
        res.render('usertop', data);
    }
});

module.exports = router;
